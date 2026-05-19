export interface Supplier {
  supplier_id: string;
  name: string;
  category: string;
  password: string | null;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  supplier_id: string;
  name: string;
  category: string;
  status: string;
}

export interface Order {
  id: string;
  supplier_id: string;
  date: string;
  status: string;
  total: number;
}

export interface Lot {
  id: string;
  supplier_id: string;
  product_type: string;
  region: string;
  gross_weight: number;
  process: string;
  packaging: string;
  harvest_date: string;
  photos: string[];
  status: string;
  created_at: string;
}

export interface Payment {
  id: string;
  supplier_id: string;
  lot_id: string;
  lot_name: string;
  percentage: number;
  amount: number;
  bank: string;
  date: string;
  status: "enviado" | "pagado" | "pendiente";
}

export const suppliers: Supplier[] = [
  {
    supplier_id: "SUP-001",
    name: "Productores San Juan",
    category: "cacao",
    password: null,
    status: "active",
  },
  {
    supplier_id: "SUP-002",
    name: "Exportadora del Valle",
    category: "cacao",
    password: null,
    status: "active",
  },
  {
    supplier_id: "SUP-003",
    name: "Finca Las Montañas",
    category: "cacao",
    password: "demo123",
    status: "active",
  },
];

export const products: Product[] = [
  { id: "PRD-001", supplier_id: "SUP-001", name: "Cacao Chuncho Premium", category: "cacao", status: "activo" },
  { id: "PRD-002", supplier_id: "SUP-001", name: "Cacao Chuncho Selecto", category: "cacao", status: "activo" },
  { id: "PRD-003", supplier_id: "SUP-001", name: "Cacao Chuncho Orgánico", category: "cacao", status: "pendiente" },
  { id: "PRD-004", supplier_id: "SUP-002", name: "Cacao Fino de Aroma", category: "cacao", status: "activo" },
  { id: "PRD-005", supplier_id: "SUP-002", name: "Cacao Trinitario", category: "cacao", status: "activo" },
  { id: "PRD-006", supplier_id: "SUP-003", name: "Cacao Chuncho Especial", category: "cacao", status: "activo" },
  { id: "PRD-007", supplier_id: "SUP-003", name: "Cacao Chuncho Nativo", category: "cacao", status: "activo" },
];

export const orders: Order[] = [
  { id: "ORD-001", supplier_id: "SUP-001", date: "2026-04-15", status: "completada", total: 12500 },
  { id: "ORD-002", supplier_id: "SUP-001", date: "2026-04-28", status: "en_proceso", total: 8300 },
  { id: "ORD-003", supplier_id: "SUP-001", date: "2026-05-01", status: "pendiente", total: 15200 },
  { id: "ORD-004", supplier_id: "SUP-002", date: "2026-04-10", status: "completada", total: 22100 },
  { id: "ORD-005", supplier_id: "SUP-002", date: "2026-04-22", status: "en_proceso", total: 18750 },
  { id: "ORD-006", supplier_id: "SUP-003", date: "2026-04-18", status: "completada", total: 9800 },
  { id: "ORD-007", supplier_id: "SUP-003", date: "2026-05-02", status: "pendiente", total: 13400 },
];

export const lots: Lot[] = [
  {
    id: "LOT-001",
    supplier_id: "SUP-001",
    product_type: "Cacao Chuncho",
    region: "Echarati, Quillabamba",
    gross_weight: 1250,
    process: "Lavado / Washed",
    packaging: "Sacos de yute",
    harvest_date: "2026-03-15",
    photos: [],
    status: "recibido",
    created_at: "2026-04-01",
  },
  {
    id: "LOT-002",
    supplier_id: "SUP-001",
    product_type: "Cacao Chuncho",
    region: "Echarati, Quillabamba",
    gross_weight: 800,
    process: "Natural",
    packaging: "Sacos de polipropileno",
    harvest_date: "2026-02-20",
    photos: [],
    status: "en_evaluación",
    created_at: "2026-04-10",
  },
  {
    id: "LOT-003",
    supplier_id: "SUP-002",
    product_type: "Cacao Fino",
    region: "Echarati, Quillabamba",
    gross_weight: 1500,
    process: "Honey",
    packaging: "Cajas de madera",
    harvest_date: "2026-01-10",
    photos: [],
    status: "recibido",
    created_at: "2026-03-20",
  },
  {
    id: "LOT-004",
    supplier_id: "SUP-003",
    product_type: "Cacao Chuncho",
    region: "Echarati, Quillabamba",
    gross_weight: 950,
    process: "Lavado / Washed",
    packaging: "Sacos de yute",
    harvest_date: "2026-03-25",
    photos: [],
    status: "recibido",
    created_at: "2026-04-05",
  },
];

export const payments: Payment[] = [
  { id: "PAY-001", supplier_id: "SUP-001", lot_id: "LOT-001", lot_name: "Cacao Chuncho - Echarati", percentage: 100, amount: 12500, bank: "Bancolombia", date: "2026-04-05", status: "pagado" },
  { id: "PAY-002", supplier_id: "SUP-001", lot_id: "LOT-002", lot_name: "Cacao Chuncho - Echarati", percentage: 50, amount: 5000, bank: "Davivienda", date: "2026-04-15", status: "enviado" },
  { id: "PAY-003", supplier_id: "SUP-002", lot_id: "LOT-003", lot_name: "Cacao Fino - Arauca", percentage: 100, amount: 22100, bank: "BBVA", date: "2026-03-25", status: "pagado" },
  { id: "PAY-004", supplier_id: "SUP-003", lot_id: "LOT-004", lot_name: "Cacao Chuncho - Echarati", percentage: 30, amount: 3500, bank: "Bancolombia", date: "2026-04-20", status: "pendiente" },
];