import { User, CreditCard, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface OrgHeaderProps {
    user: string;
}

const OrgHeader = ({ user }: OrgHeaderProps) => {
  const memberName = user;

  const profiletoast = () => {
    toast("Not yet implemented hehe");
  }

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-lg border-b border-purple-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-16">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-4 pl-4 sm:pl-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2.5 shadow-lg ring-2 ring-purple-300/30">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                Batis
                            </h1>
                            <p className="text-xs text-purple-200/80 hidden sm:block">Budget Audit Tracking Information System</p>
                        </div>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center space-x-4 pr-4 sm:pr-0">
                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                        onClick={profiletoast}
                        className="flex items-center space-x-2 p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50"
                        >
                        <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-1.5 shadow-md">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden sm:block text-sm font-medium">{memberName}</span>
                        <ChevronDown
                            className="h-4 w-4 transition-transform"
                        />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </header>
    </>
  );
};

export default OrgHeader;