"use client";

import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Image from "next/image";
import { TbPencil, TbPhoto } from "react-icons/tb";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { isBase64Image } from "@/lib/utils";

interface Props {
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
}

function MyAccount({ user }: Props) {
  const [files, setFiles] = useState<File[]>();

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: { name: "", url: user?.image || "", type: "" },
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof UserValidation>) => {
    await updateUser(
      user.id,
      {
        username: values.username,
        name: values.name,
        image: values.profile_photo,
        bio: values.bio,
      },
      pathname
    );

    if (pathname === "/profile/edit") {
      router.push(`/profile/${user.id}`);
    } else {
      router.push("/");
    }
  };

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>,
    fieldChange: ({
      name,
      url,
      type,
    }: {
      name?: string;
      url: string;
      type?: string;
    }) => void
  ) => {
    event.preventDefault();

    const fileReader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      setFiles(Array.from(event.target.files));

      fileReader.onload = async (event) => {
        const imageDataURL = event.target?.result?.toString() || "";
        fieldChange({ name: file.name, url: imageDataURL, type: file.type });
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center gap-4">
              <FormLabel className="relative account-form_image-label cursor-pointer h-32 w-32">
                {field.value ? (
                  <Image
                    src={field.value.url}
                    alt="Profile Photo"
                    fill
                    className="cursor-pointer object-cover rounded-full"
                  />
                ) : (
                  <TbPhoto className="text-light-1" size={24} />
                )}
                {field.value && (
                  <div className="absolute flex justify-center items-center w-full h-full bg-black opacity-0 hover:opacity-50 rounded-full">
                    <TbPencil className="text-light-1" size={32} />
                  </div>
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200 hidden">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-primary-500" type="submit">
          Continue
        </Button>
      </form>
    </Form>
  );
}

export default MyAccount;
