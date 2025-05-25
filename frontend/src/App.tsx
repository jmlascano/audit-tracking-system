import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      Landing page
      <Button variant="outline"><Link to="/login">Log in</Link></Button>
      <Button variant="outline"><Link to="/org-signup">Sign up as an Organization</Link></Button>
      <Button variant="outline"><Link to="/member-signup">Sign up as Member</Link></Button>
    </div>
  );
}

export default App
