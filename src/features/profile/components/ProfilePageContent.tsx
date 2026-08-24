import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardProfileImage from "./CardProfileImage";
import CardProfileAbout from "./CardProfileAbout";
import CardProfileSetting from "./CardProfileSetting";
import ChangePasswordCard from "./ChangePasswordCard";
import { useLocation } from "react-router";

const ProfilePageContent: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("setting");

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment === "change-password") {
            setActiveTab("change-password");
        } else {
            setActiveTab("setting");
        }
    }, [location.pathname]);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <CardProfileImage />
                    <CardProfileAbout />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="setting">Setting</TabsTrigger>
                            <TabsTrigger value="change-password">Change Password</TabsTrigger>
                        </TabsList>

                        <TabsContent value="setting" className="mt-6">
                            <CardProfileSetting />
                        </TabsContent>

                        <TabsContent value="change-password" className="mt-6">
                            <ChangePasswordCard />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfilePageContent;
