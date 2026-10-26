-- Ejecutar con la aplicacion detenida, antes de desplegar el flujo nuevo.
-- Conservar un respaldo previo de la base de datos.
-- No se modifican fechas ni los registros historicos de movimientos o gastos.

UPDATE requisiciones
SET status = 'cotizando'
WHERE status = 'aprobada';

-- El ENUM debe coincidir con backend/models/Requisicion.js.
ALTER TABLE requisiciones
  MODIFY COLUMN status ENUM(
    'creada',
    'cotizando',
    'esperando autorizacion',
    'autorizada',
    'proceso de pago',
    'proveedor preparando envío',
    'rechazada',
    'liberacion aduanal',
    'proceso de entrega',
    'entregada parcial',
    'concluida',
    'cancelada'
  ) NOT NULL DEFAULT 'creada';

-- Debe devolver cero; los historiales mantienen el status original.
SELECT COUNT(*) AS requisicionesConStatusRetirado
FROM requisiciones
WHERE status = 'aprobada';

SHOW COLUMNS FROM requisiciones LIKE 'status';
