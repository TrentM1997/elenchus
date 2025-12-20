import { Link } from "react-router-dom";


export default function AuthFooterLinks() {


    return (
        <>
            <div>
                <p className="font-medium text-sm leading-tight text-white mx-auto">Forgot your password?
                    <Link className="text-white underline hover:text-blue-400 transition-colors ease-soft duration-200 ml-3" to={'/email-for-reset'}>
                        Reset Password
                    </Link>
                </p>
            </div>
            <div>
                <p className="font-medium text-sm leading-tight text-white mx-auto">Don't have an account?
                    <Link className="text-white underline hover:text-blue-400 transition-colors ease-soft duration-200 ml-3" to={'/signup'}>
                        Join now
                    </Link>
                </p>
            </div>
        </>
    );
};


