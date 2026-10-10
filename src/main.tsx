import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { OpeningExperience } from './components/opening/OpeningExperience';
import './index.css';

createRoot(document.getElementById('root')!).render(<OpeningExperience><App /></OpeningExperience>);
