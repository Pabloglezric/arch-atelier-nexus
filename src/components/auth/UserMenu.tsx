import { User, LogOut, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  email: string;
  isAdmin: boolean;
  onSignOut: () => void;
  themeColor?: string;
}

const UserMenu = ({ email, isAdmin, onSignOut, themeColor = 'hsl(45, 100%, 60%)' }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" style={{ color: themeColor }}>
          <User className="h-4 w-4" />
          <span className="hidden lg:inline max-w-[120px] truncate text-xs">{email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-black/95 border-amber-500/20 text-white">
        {isAdmin && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10">
              <Link to="/admin/newsletter" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Admin Newsletter</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-amber-500/10" />
          </>
        )}
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10">
          <Link to="/account" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-amber-500/10" />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer hover:bg-amber-500/10">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
