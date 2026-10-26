import {defineConfig} from 'vite';
export default defineConfig({base:"/dotbeats-case-studio/",build:{target:'esnext',rollupOptions:{input:{main:'index.html',button:'button/index.html',buttonB02:'button-b02/index.html',combined:'combined/index.html'}}}});
