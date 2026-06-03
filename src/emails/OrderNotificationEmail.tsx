import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { OrderEmailData } from './types';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n);

const shortId = (id: string) => id.slice(-8).toUpperCase();

interface Props extends OrderEmailData {
  adminPanelUrl?: string;
}

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
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>🛒 Nueva orden #{shortId(orderId)} — {customer.name} · {fmt(total)}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={brand}>UNIK</Text>
            <Text style={headerSub}>Nueva orden recibida</Text>
          </Section>

          <Section style={content}>

            {/* Alert banner */}
            <Section style={alertBanner}>
              <Text style={alertText}>
                🛒 Nueva compra confirmada · Orden #{shortId(orderId)}
              </Text>
            </Section>

            <Text style={dateLine}>{orderDate}</Text>

            <Hr style={hr} />

            {/* Customer info */}
            <Text style={sectionTitle}>Datos del cliente</Text>
            <Section style={infoBox}>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Nombre</Text></Column>
                <Column><Text style={valueStyle}>{customer.name}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Email</Text></Column>
                <Column><Text style={valueStyle}>{customer.email}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Shipping address */}
            <Text style={sectionTitle}>Dirección de envío</Text>
            <Section style={infoBox}>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Destinatario</Text></Column>
                <Column><Text style={valueStyle}>{address.firstName} {address.lastName}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Dirección</Text></Column>
                <Column>
                  <Text style={valueStyle}>
                    {address.address}{address.address2 ? `, ${address.address2}` : ''}
                  </Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Ciudad</Text></Column>
                <Column><Text style={valueStyle}>{address.city}{address.postalCode ? ` — CP ${address.postalCode}` : ''}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>País</Text></Column>
                <Column><Text style={valueStyle}>{address.country}</Text></Column>
              </Row>
              <Row style={infoRow}>
                <Column style={infoLabel}><Text style={labelStyle}>Teléfono</Text></Column>
                <Column><Text style={valueStyle}>{address.phone}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Products */}
            <Text style={sectionTitle}>Productos ordenados</Text>

            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={{ flex: 1 }}>
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
            <Section style={totalsSection}>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Subtotal</Text></Column>
                <Column><Text style={totalValue}>{fmt(subTotal)}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>IVA (19%)</Text></Column>
                <Column><Text style={totalValue}>{fmt(tax)}</Text></Column>
              </Row>
              <Row style={{ ...totalRow, borderTop: '2px solid #D61C1C', paddingTop: '10px', marginTop: '4px' }}>
                <Column><Text style={grandTotalLabel}>TOTAL</Text></Column>
                <Column><Text style={grandTotalValue}>{fmt(total)}</Text></Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Transaction */}
            <Text style={txText}>
              ID de transacción PayPal:{' '}
              <span style={{ fontFamily: 'monospace' }}>{transactionId}</span>
            </Text>

            {/* CTA */}
            {adminPanelUrl && (
              <Section style={ctaSection}>
                <Link href={adminPanelUrl} style={ctaButton}>
                  Ver orden en el panel →
                </Link>
              </Section>
            )}

          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este mensaje es automático enviado desde el sistema de UNIK.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default OrderNotificationEmail;

// ── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F4F4F5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden',
};

const header: React.CSSProperties = {
  backgroundColor: '#111111',
  padding: '24px 40px',
  textAlign: 'center',
};

const brand: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '4px',
  margin: '0 0 4px',
};

const headerSub: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '12px',
  margin: 0,
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

const content: React.CSSProperties = {
  padding: '28px 40px',
};

const alertBanner: React.CSSProperties = {
  backgroundColor: '#FFF5F5',
  border: '1px solid #FECACA',
  borderRadius: '6px',
  padding: '12px 16px',
  marginBottom: '8px',
};

const alertText: React.CSSProperties = {
  color: '#D61C1C',
  fontSize: '14px',
  fontWeight: '700',
  margin: 0,
};

const dateLine: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  margin: '4px 0 0',
};

const hr: React.CSSProperties = {
  borderColor: '#E5E5E5',
  margin: '20px 0',
};

const sectionTitle: React.CSSProperties = {
  color: '#111111',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const infoBox: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderRadius: '6px',
  padding: '4px 16px',
};

const infoRow: React.CSSProperties = {
  borderBottom: '1px solid #EEEEEE',
  padding: '6px 0',
};

const infoLabel: React.CSSProperties = {
  width: '110px',
  verticalAlign: 'top',
};

const labelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '12px',
  fontWeight: '600',
  margin: 0,
};

const valueStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  margin: 0,
};

const itemRow: React.CSSProperties = {
  borderBottom: '1px solid #F4F4F5',
  padding: '8px 0',
};

const itemName: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  margin: 0,
};

const itemQtyCol: React.CSSProperties = {
  width: '48px',
  textAlign: 'center',
};

const itemPriceCol: React.CSSProperties = {
  width: '110px',
  textAlign: 'right',
};

const itemDetail: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  margin: 0,
};

const totalsSection: React.CSSProperties = {
  maxWidth: '240px',
  marginLeft: 'auto',
};

const totalRow: React.CSSProperties = {
  padding: '3px 0',
};

const totalLabel: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  margin: 0,
};

const totalValue: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  textAlign: 'right',
  margin: 0,
};

const grandTotalLabel: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '800',
  margin: '0 0 2px',
};

const grandTotalValue: React.CSSProperties = {
  color: '#D61C1C',
  fontSize: '18px',
  fontWeight: '800',
  textAlign: 'right',
  margin: '0 0 2px',
};

const txText: React.CSSProperties = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 0 20px',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '8px',
};

const ctaButton: React.CSSProperties = {
  backgroundColor: '#D61C1C',
  borderRadius: '6px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '700',
  padding: '12px 28px',
  textDecoration: 'none',
};

const footer: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderTop: '1px solid #E5E5E5',
  padding: '16px 40px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '11px',
  margin: 0,
};
