import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/entities";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";
import { CardStylePicker } from "@/components/image-pickers/card-style-picker";

const editProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  picture: z.string().optional(),
});

type EditProductForm = z.infer<typeof editProductSchema>;

const EditProductDialog = ({
  isOpen,
  onClose,
  product,
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onEdit: (product: EditProductForm) => void;
}) => {
  const supabase = createClient();

  const handleUploadImageToSupabase = async (file: File) => {
    const { error } = await supabase.storage
      .from("products")
      .upload(file.name, file);

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const { data: publicUrl } = await supabase.storage
      .from("products")
      .getPublicUrl(file.name);

    return publicUrl;
  };

  const form = useForm<EditProductForm>({
    defaultValues: {
      title: product.title,
      description: product.description,
      picture: product.picture,
    },
    resolver: zodResolver(editProductSchema),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Edit the product details below.</DialogDescription>
        </DialogHeader>
        <Separator className="bg-primary" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Picture</FormLabel>
                  <FormControl>
                    <CardStylePicker
                      onImageSelect={async (file: File) => {
                        const uploadedImage = await handleUploadImageToSupabase(
                          file
                        );
                        form.setValue(
                          "picture",
                          uploadedImage?.publicUrl || ""
                        );
                      }}
                      defaultImage={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-primary" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
