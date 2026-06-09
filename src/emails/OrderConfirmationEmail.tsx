import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { OrderEmailData } from './types';

interface Props extends OrderEmailData {
  /** Base app URL for logo image (e.g. https://3dge.co) */
  appUrl?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const shortId = (id: string) => id.slice(-8).toUpperCase();

export function OrderConfirmationEmail({
  orderId,
  orderDate,
  transactionId,
  customer,
  address,
  items,
  subTotal,
  tax,
  total,
  appUrl = '',
}: Props) {
  const logoUrl = appUrl ? `${appUrl}/imgs/logo.png` : null;
  const isLocalhost = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');

  return (
    <Html lang="es">
      <Head />
      <Preview>¡Compra confirmada! Orden #{shortId(orderId)} · {fmt(total)} — 3DGE</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* ── Header ink bar ── */}
          <Section style={headerInk}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                {logoUrl && !isLocalhost && (
                  <Img
                    src={logoUrl}
                    width="36"
                    height="36"
                    alt="3DGE"
                    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}
                  />
                )}
                <Text style={brandText}>3<span style={{ fontStyle: 'italic' }}>D</span>GE</Text>
              </Column>
            </Row>
          </Section>

          {/* ── Yellow accent strip ── */}
          <Section style={yellowStrip}>
            <Text style={yellowStripText}>Confirmación de compra</Text>
          </Section>

          {/* ── Content ── */}
          <Section style={content}>

            <Text style={greeting}>
              Hola, {address.firstName} 👋
            </Text>
            <Text style={para}>
              Tu pago fue recibido y tu pedido está siendo preparado.
              Aquí tienes el resumen de tu compra.
            </Text>

            {/* Order meta */}
            <Section style={metaBox}>
              <Row>
                <Column style={metaCol}>
                  <Text style={metaLabel}>Orden</Text>
                  <Text style={metaValue}>#{shortId(orderId)}</Text>
                </Column>
                <Column style={metaCol}>
                  <Text style={metaLabel}>Fecha</Text>
                  <Text style={metaValue}>{orderDate}</Text>
                </Column>
                <Column style={metaCol}>
                  <Text style={metaLabel}>Estado</Text>
                  <Text style={{ ...metaValue, color: '#16a34a', fontWeight: '700' }}>Pagado ✓</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Items */}
            <Text style={sectionTitle}>Productos ordenados</Text>

            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.title}</Text>
                </Column>
                <Column style={itemQtyCol}>
                  <Text style={itemDetail}>×{item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemDetail}>{fmt(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            {/* Totals */}
            <Section style={totalsWrap}>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Subtotal</Text></Column>
                <Column><Text style={totalValue}>{fmt(subTotal)}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>IVA (19 %)</Text></Column>
                <Column><Text style={totalValue}>{fmt(tax)}</Text></Column>
              </Row>
              <Row style={grandRow}>
                <Column><Text style={grandLabel}>Total pagado</Text></Column>
                <Column><Text style={grandValue}>{fmt(total)}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Shipping address */}
            <Text style={sectionTitle}>Dirección de envío</Text>
            <Section style={addressBox}>
              <Text style={addressLine}><strong>{address.firstName} {address.lastName}</strong></Text>
              <Text style={addressLine}>{address.address}{address.address2 ? `, ${address.address2}` : ''}</Text>
              <Text style={addressLine}>{address.city}{address.postalCode ? ` (CP {address.postalCode})` : ''}</Text>
              <Text style={addressLine}>{address.country}</Text>
              <Text style={addressLine}>Tel: {address.phone}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={txText}>
              ID de transacción MercadoPago:{' '}
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#444' }}>{transactionId}</span>
            </Text>

            <Text style={helpText}>
              ¿Tienes alguna pregunta? Puedes responder este correo o escribirnos a{' '}
              <span style={{ color: '#1f3fd6' }}>contacto@3dge.co</span> — con gusto te ayudamos.
            </Text>

          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerBrand}>3DGE</Text>
            <Text style={footerText}>Organizadores de pared · Bogotá, Colombia</Text>
            <Text style={footerText}>© {new Date().getFullYear()} 3DGE. Todos los derechos reservados.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;

// ── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#e9e6dd',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '580px',
  margin: '0 auto',
  overflow: 'hidden',
};

const headerInk: React.CSSProperties = {
  backgroundColor: '#141210',
  padding: '26px 40px 20px',
  textAlign: 'center',
};

const brandText: React.CSSProperties = {
  color: '#f6f4ee',
  fontSize: '26px',
  fontWeight: '900',
  letterSpacing: '2px',
  margin: 0,
  display: 'inline-block',
  verticalAlign: 'middle',
};

const yellowStrip: React.CSSProperties = {
  backgroundColor: '#f5c200',
  padding: '10px 40px',
};

const yellowStripText: React.CSSProperties = {
  color: '#141210',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: 0,
  textAlign: 'center',
};

const content: React.CSSProperties = {
  padding: '32px 40px 24px',
};

const greeting: React.CSSProperties = {
  color: '#141210',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const para: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.65',
  margin: '0 0 24px',
};

const metaBox: React.CSSProperties = {
  backgroundColor: '#f6f4ee',
  border: '1px solid #e9e6dd',
  padding: '16px 20px',
  marginBottom: '24px',
};

const metaCol: React.CSSProperties = {
  width: '33%',
};

const metaLabel: React.CSSProperties = {
  color: '#999',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0 0 3px',
};

const metaValue: React.CSSProperties = {
  color: '#141210',
  fontSize: '14px',
  fontWeight: '600',
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: '#e9e6dd',
  margin: '20px 0',
};

const sectionTitle: React.CSSProperties = {
  color: '#141210',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  margin: '0 0 12px',
};

const itemRow: React.CSSProperties = {
  borderBottom: '1px solid #f0ede6',
  padding: '9px 0',
};

const itemName: React.CSSProperties = {
  color: '#141210',
  fontSize: '14px',
  margin: 0,
};

const itemQtyCol: React.CSSProperties = {
  width: '50px',
  textAlign: 'center',
};

const itemPriceCol: React.CSSProperties = {
  width: '110px',
  textAlign: 'right',
};

const itemDetail: React.CSSProperties = {
  color: '#555',
  fontSize: '14px',
  margin: 0,
};

const totalsWrap: React.CSSProperties = {
  maxWidth: '260px',
  marginLeft: 'auto',
};

const totalRow: React.CSSProperties = {
  padding: '4px 0',
};

const totalLabel: React.CSSProperties = {
  color: '#666',
  fontSize: '13px',
  margin: 0,
};

const totalValue: React.CSSProperties = {
  color: '#141210',
  fontSize: '13px',
  textAlign: 'right',
  margin: 0,
};

const grandRow: React.CSSProperties = {
  borderTop: '2px solid #141210',
  padding: '10px 0 4px',
  marginTop: '4px',
};

const grandLabel: React.CSSProperties = {
  color: '#141210',
  fontSize: '15px',
  fontWeight: '700',
  margin: 0,
};

const grandValue: React.CSSProperties = {
  color: '#141210',
  fontSize: '18px',
  fontWeight: '800',
  textAlign: 'right',
  margin: 0,
};

const addressBox: React.CSSProperties = {
  backgroundColor: '#f6f4ee',
  border: '1px solid #e9e6dd',
  padding: '14px 18px',
};

const addressLine: React.CSSProperties = {
  color: '#444',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 2px',
};

const txText: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
  margin: '0 0 16px',
};

const helpText: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0,
};

const footer: React.CSSProperties = {
  backgroundColor: '#141210',
  padding: '22px 40px',
  textAlign: 'center',
};

const footerBrand: React.CSSProperties = {
  color: '#f5c200',
  fontSize: '14px',
  fontWeight: '800',
  letterSpacing: '3px',
  margin: '0 0 4px',
};

const footerText: React.CSSProperties = {
  color: '#6c685f',
  fontSize: '11px',
  margin: '0 0 2px',
};
