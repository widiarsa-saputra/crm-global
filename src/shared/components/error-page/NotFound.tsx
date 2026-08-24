import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="text-8xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            404
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go Back Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
