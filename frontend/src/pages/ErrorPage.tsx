import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return(
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            Oops, something went wrong!
            <Button variant="outline"><Link to="/">Go back to landing</Link></Button>
        </div>
    )
}

export default ErrorPage;