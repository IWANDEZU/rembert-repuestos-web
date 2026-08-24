-- La API pública de Supabase no debe exponer directamente tablas de comercio.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rembert_app') THEN
    ALTER ROLE rembert_app BYPASSRLS;
  END IF;
END $$;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'User', 'Account', 'Session', 'Address', 'Category', 'Brand',
    'Product', 'ProductImage', 'Variant', 'ProductAttribute', 'Favorite',
    'Review', 'Cart', 'CartItem', 'Coupon', 'Order', 'OrderItem'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

-- Función heredada del proyecto: solo administración interna puede invocarla.
DO $$
BEGIN
  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
  END IF;
END $$;
