import { getSettings } from '@/actions';
import { SettingsClient } from './ui/SettingsClient';

export default async function ConfiguracionPage() {
  const settings = await getSettings();
  return (
    <SettingsClient
      adminEmail={settings.adminEmail}
      heroImageMain={settings.heroImageMain ?? null}
      heroImageLeft={settings.heroImageLeft ?? null}
      heroImageRight={settings.heroImageRight ?? null}
    />
  );
}
