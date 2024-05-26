import DynamicForm from './components/DynamicForm';
import configJson from './assets/Config.json';

export default function App() {
  return (
    <>
      <DynamicForm config={configJson} />
    </>
  );
}