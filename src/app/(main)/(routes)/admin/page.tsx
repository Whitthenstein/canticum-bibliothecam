"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthorForm } from "../../../../components/AuthorForm";
import { SongForm } from "../../../../components/SongForm";
import { TRANSLATIONS } from "@/lib/translations";
import useAdminLogin from "@/hooks/useAdminLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AnimatedLoadingCircle from "@/components/AnimatedLoadingCircle";

import { Eye, EyeClosed } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [inputtedPassword, setInputtedPassword] = useState("");
  const { isAuthenticated, submitPasswordAndCheck } = useAdminLogin();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmitClick = async () => {
    setIsSubmittingPassword(true);

    const isCorrectPassword = await submitPasswordAndCheck(inputtedPassword);

    toast(
      isCorrectPassword
        ? { title: "Olá Administrador!" }
        : { variant: "destructive", title: "Password incorrecta! Tente novamente." }
    );

    setIsSubmittingPassword(false);
  };

  return !isAuthenticated ? (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle>Administrador</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex flex-row items-center gap-4">
          {"Password: "}
          <Input
            type={passwordVisible ? "text" : "password"}
            value={inputtedPassword}
            onChange={(e) => setInputtedPassword(e.target.value)}
          />
          <Button variant="secondary" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <Eye /> : <EyeClosed />}
          </Button>
        </div>
        <div>
          <Button className="flex items-center justify-center" onClick={handleSubmitClick}>
            {isSubmittingPassword ? <AnimatedLoadingCircle /> : TRANSLATIONS.pt.submit}
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex flex-row gap-20 p-8">
      <Tabs defaultValue="add-author" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-author">{TRANSLATIONS.pt.addAuthor}</TabsTrigger>
          <TabsTrigger value="add-song">{TRANSLATIONS.pt.addSong}</TabsTrigger>
        </TabsList>
        <TabsContent value="add-author">
          <Card>
            <CardHeader>
              <CardTitle>{TRANSLATIONS.pt.author}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <AuthorForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add-song">
          <Card>
            <CardHeader>
              <CardTitle>{TRANSLATIONS.pt.song}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <SongForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
