"use client";

import React from "react";
import { SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import useAdminLogin from "@/hooks/useAdminLogin";

const EditTrigger = () => {
  const { isAuthenticated } = useAdminLogin();
  return (
    <SheetTrigger asChild>
      {isAuthenticated && (
        <Button variant="secondary">
          <Pencil />
        </Button>
      )}
    </SheetTrigger>
  );
};

export default EditTrigger;
