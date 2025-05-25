import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import MembersTable from "@/components/custom/MembersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const OrgPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const org_id = user.id ? user.id : 1; // Since user could be null, lets just default it to 1 lol
    const org_name = user.name ? user.name : "Young Software Engineers' Society"; // Since user could be null, lets just default it to YSES lol

  const handleLogout = () => {
    // Remove user data in local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }

  return (
    <>
      <div className="flex justify-between mx-16 my-8">
        <h1 className="text-2xl font-bold font-inter">Hi {org_name}!</h1>
        <Button variant="destructive" onClick={handleLogout}><Link to="/">Log Out</Link></Button>
      </div>
      <Tabs defaultValue="members" className="mx-16 my-8">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable org_id={org_id} />
        </TabsContent>
        <TabsContent value="fees">
          Put the fee table and other details here
        </TabsContent>
      </Tabs>
    </>
  );
};


export default OrgPage;
