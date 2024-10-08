import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

interface LoginButtonProps {
  onClick?: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="mt-8 px-4 py-3 bg-[#52b39e] text-white rounded-md transition-colors duration-300"
      onClick={onClick}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  )
}