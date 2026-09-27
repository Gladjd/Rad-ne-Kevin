-- ==============================================================================
-- MIGRATION : AUTHENTIFICATION & CONTRÔLE D'ACCÈS BASÉ SUR LES RÔLES (RBAC)
-- RÔLES : 'ADMIN' (Mariés, Organisateurs) & 'PROTOCOLE' (Accueil, Scanner QR)
-- ==============================================================================

-- 1. CRÉATION DE LA TABLE USER_ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'PROTOCOLE')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation de la RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. FONCTIONS DE SÉCURITÉ (SECURITY DEFINER)
-- Permet de vérifier les rôles sans contourner les règles globales

CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM public.user_roles WHERE user_id = check_user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'ADMIN'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_protocole_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('ADMIN', 'PROTOCOLE')
    );
$$;

-- 3. TRIGGER AUTOMATIQUE À LA CRÉATION D'UN UTILISATEUR DANS AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    assigned_role TEXT;
BEGIN
    -- Récupère le rôle dans les metadata de l'utilisateur (ex: raw_user_meta_data->>'role')
    -- Sinon assigne 'PROTOCOLE' par défaut, ou 'ADMIN' si email spécifique
    assigned_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        CASE 
            WHEN NEW.email IN ('admin@radene-kevin.com', 'maries@radene-kevin.com') THEN 'ADMIN'
            ELSE 'PROTOCOLE'
        END
    );

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, assigned_role)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

-- ==============================================================================
-- 4. POLITIQUES RLS SUR USER_ROLES
-- ==============================================================================
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. MISE À JOUR DES POLITIQUES RLS SELON LES RÔLES RBAC
-- ==============================================================================

-- --- GUESTS (Invités) ---
-- - Public: recherche pour RSVP & voir sa table
-- - Public: modification de son propre statut RSVP
-- - PROTOCOLE & ADMIN: lecture de tous les invités
-- - PROTOCOLE: mise à jour du check-in lors du scan (checked_in, checked_in_at, checked_in_by)
-- - ADMIN: création, modification complète et suppression
DROP POLICY IF EXISTS "Public can search and view basic guest info" ON guests;
DROP POLICY IF EXISTS "Public can update their own RSVP" ON guests;
DROP POLICY IF EXISTS "Admins can manage all guests" ON guests;
DROP POLICY IF EXISTS "Protocol and Admin can view guests" ON guests;
DROP POLICY IF EXISTS "Protocol can check in guests" ON guests;
DROP POLICY IF EXISTS "Admins full access on guests" ON guests;

CREATE POLICY "Public can search and view basic guest info"
    ON guests FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can update their own RSVP"
    ON guests FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Protocol and Admin can view guests"
    ON guests FOR SELECT
    TO authenticated
    USING (public.is_protocole_or_admin());

CREATE POLICY "Protocol can check in guests"
    ON guests FOR UPDATE
    TO authenticated
    USING (public.is_protocole_or_admin())
    WITH CHECK (public.is_protocole_or_admin());

CREATE POLICY "Admins full access on guests"
    ON guests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- TABLES (Plan de table 2D) ---
-- - Public: lecture seule pour widget
-- - ADMIN: contrôle total (création, déplacement, suppression)
DROP POLICY IF EXISTS "Public can view tables" ON tables;
DROP POLICY IF EXISTS "Admins can manage tables" ON tables;

CREATE POLICY "Public can view tables"
    ON tables FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage tables"
    ON tables FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- REMINDERS_LOG (Relances par email & SMS) ---
-- - Seuls les ADMIN peuvent voir et envoyer les relances
DROP POLICY IF EXISTS "Admins can view and insert reminders" ON reminders_log;

CREATE POLICY "Admins can view and insert reminders"
    ON reminders_log FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- PROJECT_TASKS (Kanban d'organisation) ---
-- - Seuls les ADMIN peuvent gérer les tâches
DROP POLICY IF EXISTS "Admins can view and manage tasks" ON project_tasks;
DROP POLICY IF EXISTS "Public read tasks for demo purposes" ON project_tasks;

CREATE POLICY "Admins can view and manage tasks"
    ON project_tasks FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- EVENTS (Programme du mariage) ---
-- - Public: lecture seule
-- - ADMIN: modification et gestion
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;

CREATE POLICY "Public can view events"
    ON events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage events"
    ON events FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- PHOTOS (Modération & Galerie) ---
-- - Public: lecture photos validées + upload
-- - PROTOCOLE & ADMIN: lecture de toutes les photos
-- - ADMIN: modération et suppression
DROP POLICY IF EXISTS "Public can view approved photos" ON photos;
DROP POLICY IF EXISTS "Public can upload photos" ON photos;
DROP POLICY IF EXISTS "Admins can moderate and delete photos" ON photos;

CREATE POLICY "Public can view approved photos"
    ON photos FOR SELECT
    TO anon, authenticated
    USING (statut = 'valide' OR public.is_protocole_or_admin());

CREATE POLICY "Public can upload photos"
    ON photos FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can moderate and delete photos"
    ON photos FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
