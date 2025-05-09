import { useQueryCurrentUser } from "@/hooks/use-query-current-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircularAvatarPicker } from "../image-pickers/circular-avatar-picker";
import { createClient } from "@/lib/supabase/client";
import { useMutateUser } from "@/hooks/use-mutate-user";
import { Loader } from "lucide-react";

const supabase = createClient();

const editUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  profile_picture: z.string().optional(),
});

const EditUserDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: currentUser } = useQueryCurrentUser();

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      profile_picture: currentUser?.profile_picture || "",
    },
  });

  const handleUploadImageToSupabase = async (file: File) => {
    // Generate a unique filename using timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `${timestamp}-${randomString}-${file.name}`;

    const { error } = await supabase.storage
      .from("users")
      .upload(uniqueFilename, file);

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const { data: publicUrl } = await supabase.storage
      .from("users")
      .getPublicUrl(uniqueFilename);

    return publicUrl;
  };

  const { editUserMutation } = useMutateUser();

  const onSubmit = (data: z.infer<typeof editUserSchema>) => {
    editUserMutation.mutate({
      name: data.name,
      email: data.email,
      profile_picture: data.profile_picture || "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b border-primary pb-4 mb-4">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <CircularAvatarPicker
                      onImageSelect={async (file: File) => {
                        const uploadedImage = await handleUploadImageToSupabase(
                          file
                        );
                        form.setValue(
                          "profile_picture",
                          uploadedImage?.publicUrl || ""
                        );
                      }}
                      defaultImage={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between border-t border-primary pt-4 mt-4">
              <Button
                type="button"
                className="bg-white"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={editUserMutation.isPending} type="submit">
                {editUserMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
