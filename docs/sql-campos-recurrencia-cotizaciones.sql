ALTER TABLE requisiciones
  ADD COLUMN recurrenciaCompra ENUM('recurrente', 'no_recurrente') NULL DEFAULT NULL,
  ADD COLUMN cotizacionesArchivos JSON NULL;

UPDATE requisiciones
SET cotizacionesArchivos = JSON_ARRAY()
WHERE cotizacionesArchivos IS NULL;
