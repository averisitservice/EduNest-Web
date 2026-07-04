import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
// ----------------------------------------------------------------------

const PORT = 3030;

export default defineConfig({

  plugins: [
    react(),
    checker({
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.resolve(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './config/certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './config/certs/localhost.crt'))
    }
  },
  preview: {
    open: true,
    port: PORT,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './config/certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './config/certs/localhost.crt'))
    }
  }
});
