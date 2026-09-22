export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  [key: string]: unknown;
}

const config: CapacitorConfig = {
  appId: 'com.ecohabit.app',
  appName: 'Eco Habit App',
  webDir: 'dist'
};

export default config;
