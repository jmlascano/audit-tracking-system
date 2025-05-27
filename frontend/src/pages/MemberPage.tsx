import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import MembersTable from "@/components/custom/MembersTable";
import OrgFeeTable from "@/components/custom/OrgFeeTable";
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
      <div className="flex justify-between mx-16 mb-8 mt-16">
        <h1 className="text-3xl font-bold font-inter">Hi {org_name}!</h1>
        <Button variant="destructive" onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 shadow-lg">
          <Link to="/">Log Out</Link>
        </Button>
      </div>
      <Tabs defaultValue="members" className="mx-16 my-8">
        <TabsList className="bg-white border border-purple-200 shadow-lg rounded-lg">
          <TabsTrigger value="members"className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 hover:bg-purple-50">
            Members
          </TabsTrigger>
          <TabsTrigger value="fees" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 hover:bg-purple-50">
            Fees
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable org_id={org_id} />
        </TabsContent>
        <TabsContent value="fees">
          <OrgFeeTable org_id={org_id} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default OrgPage;