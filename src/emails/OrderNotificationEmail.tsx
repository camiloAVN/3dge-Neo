import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { OrderEmailData } from './types';

interface Props extends OrderEmailData {
  adminPanelUrl?: string;
  /** Base app URL for logo image (e.g. https://3dge.co) */
  appUrl?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const shortId = (id: string) => id.slice(-8).toUpperCase();

export function OrderNotificationEmail({
  orderId,
  orderDate,
  transactionId,
  customer,
  address,
  items,
  subTotal,
  tax,
  total,
  adminPanelUrl,
  appUrl = '',
}: Props) {
  const logoUrl = appUrl ? `${appUrl}/imgs/logo.png` : null;
  const isLocalhost = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');

  return (
    <Html lang="es">
      <Head />
      <Preview>🛒 Nueva orden #{shortId(orderId)} · {customer.name} · {fmt(total)}</Preview>
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

          {/* ── Red alert strip ── */}
          <Section style={redStrip}>
            <Text style={redStripText}>🛒 Nueva orden recibida</Text>
          </Section>

          <Section style={content}>

            {/* Order highlight */}
            <Section style={orderBox}>
              <Text style={orderBoxNum}>#{shortId(orderId)}</Text>
              <Text style={orderBoxDate}>{orderDate}</Text>
              <Text style={orderBoxTotal}>{fmt(total)}</Text>
            </Section>

            <Hr style={hr} />

            {/* Customer */}
            <Text style={sectionTitle}>Cliente</Text>
            <Section style={infoBox}>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>Nombre</Text></Column>
                <Column><Text style={valueStyle}>{customer.name}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>Email</Text></Column>
                <Column><Text style={valueStyle}>{customer.email}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Shipping */}
            <Text style={sectionTitle}>Dirección de envío</Text>
            <Section style={infoBox}>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>Destinatario</Text></Column>
                <Column><Text style={valueStyle}>{address.firstName} {address.lastName}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>Dirección</Text></Column>
                <Column>
                  <Text style={valueStyle}>
                    {address.address}{address.address2 ? `, ${address.address2}` : ''}
                  </Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>Ciudad</Text></Column>
                <Column>
                  <Text style={valueStyle}>
                    {address.city}{address.postalCode ? ` (CP ${address.postalCode})` : ''}
                  </Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={labelStyle}>País</Text></Column>
                <Column><Text style={valueStyle}>{address.country}</Text></Column>
              </Row>
              <Row style={{ padding: '6px 0' }}>
                <Column style={labelCol}><Text style={labelStyle}>Teléfono</Text></Column>
                <Column><Text style={valueStyle}>{address.phone}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Products */}
            <Text style={sectionTitle}>Productos ({items.reduce((s, i) => s + i.quantity, 0)} unidades)</Text>

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
                <Column><Text style={grandLabel}>TOTAL</Text></Column>
                <Column><Text style={grandValue}>{fmt(total)}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Text style={txText}>
              ID MercadoPago:{' '}
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#444' }}>{transactionId}</span>
            </Text>

            {/* CTA button */}
            {adminPanelUrl && (
              <Section style={ctaWrap}>
                <Link href={adminPanelUrl} style={ctaBtn}>
                  Ver en el panel de administración →
                </Link>
              </Section>
            )}

          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              Notificación automática del sistema 3DGE · No responder a este correo.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default OrderNotificationEmail;

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
  padding: '24px 40px 18px',
  textAlign: 'center',
};

const brandText: React.CSSProperties = {
  color: '#f6f4ee',
  fontSize: '24px',
  fontWeight: '900',
  letterSpacing: '2px',
  margin: 0,
  display: 'inline-block',
  verticalAlign: 'middle',
};

const redStrip: React.CSSProperties = {
  backgroundColor: '#e63b22',
  padding: '10px 40px',
};

const redStripText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: 0,
  textAlign: 'center',
};

const content: React.CSSProperties = {
  padding: '28px 40px 24px',
};

const orderBox: React.CSSProperties = {
  backgroundColor: '#141210',
  padding: '18px 24px',
  marginBottom: '4px',
  textAlign: 'center',
};

const orderBoxNum: React.CSSProperties = {
  color: '#f5c200',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: '0 0 4px',
};

const orderBoxDate: React.CSSProperties = {
  color: '#6c685f',
  fontSize: '12px',
  margin: '0 0 8px',
};

const orderBoxTotal: React.CSSProperties = {
  color: '#f6f4ee',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: '#e9e6dd',
  margin: '18px 0',
};

const sectionTitle: React.CSSProperties = {
  color: '#141210',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const infoBox: React.CSSProperties = {
  backgroundColor: '#f6f4ee',
  border: '1px solid #e9e6dd',
  padding: '4px 16px',
};

const infoRow: React.CSSProperties = {
  borderBottom: '1px solid #eeebe4',
  padding: '6px 0',
};

const labelCol: React.CSSProperties = {
  width: '110px',
  verticalAlign: 'top',
};

const labelStyle: React.CSSProperties = {
  color: '#999',
  fontSize: '11px',
  fontWeight: '600',
  margin: 0,
};

const valueStyle: React.CSSProperties = {
  color: '#141210',
  fontSize: '13px',
  margin: 0,
};

const itemRow: React.CSSProperties = {
  borderBottom: '1px solid #f0ede6',
  padding: '8px 0',
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
  maxWidth: '240px',
  marginLeft: 'auto',
};

const totalRow: React.CSSProperties = {
  padding: '3px 0',
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
  padding: '8px 0 4px',
  marginTop: '4px',
};

const grandLabel: React.CSSProperties = {
  color: '#141210',
  fontSize: '15px',
  fontWeight: '800',
  margin: 0,
};

const grandValue: React.CSSProperties = {
  color: '#141210',
  fontSize: '18px',
  fontWeight: '800',
  textAlign: 'right',
  margin: 0,
};

const txText: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
  margin: '0 0 18px',
};

const ctaWrap: React.CSSProperties = {
  textAlign: 'center',
};

const ctaBtn: React.CSSProperties = {
  backgroundColor: '#141210',
  color: '#f5c200',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  padding: '13px 28px',
  textDecoration: 'none',
};

const footer: React.CSSProperties = {
  backgroundColor: '#f6f4ee',
  borderTop: '2px solid #e9e6dd',
  padding: '14px 40px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  margin: 0,
};
