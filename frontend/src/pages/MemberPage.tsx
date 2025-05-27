import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import MembersTable from "@/components/custom/MembersTable";
import MembersFeeTable from "@/components/custom/MembersFeeTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/custom/Header";
import { useNavigate } from 'react-router-dom';

const MemberPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const member_id = user.id ? user.id : 1; // Since user could be null, lets just default it to 1 lol
    const member_name = user.name ? user.name : "Young Software Engineers' Society"; // Since user could be null, lets just default it to YSES lol

  const handleLogout = () => {
        // Remove user data in local storage
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        navigate('/');
        
    }

  return (
    <>
    <Header  onLogout={handleLogout}
            user={user}  />
      <div className="flex justify-between mx-12 mb-8 mt-9">
        <h1 className="text-3xl font-bold font-inter">Hi, {member_name}!</h1>
      </div>
        <MembersFeeTable member_id={member_id} />
    </>
  );
};

export default MemberPage;