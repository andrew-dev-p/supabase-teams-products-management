"use client";

import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";
import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CardStylePicker } from "@/components/image-pickers/card-style-picker";
import { createClient } from "@/lib/supabase/client";

const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  image: z.string().optional(),
});

type Product = z.infer<typeof productSchema>;

const CreateTeamProduct = () => {
  const supabase = createClient();

  const params = useParams();
  const slug = params.slug;

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const handleUploadImageToSupabase = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("products")
      .upload(file.name, file);
    if (error) {
      console.error("Error uploading image:", error);
    }
    return data;
  };

  const getTeamQuery = useQueryTeam(slug as string);

  const onSubmit = async (data: Product) => {
    console.log(data);
  };

  const isSubmitting = false;

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/teams/${slug}/products`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Enter the details of your new product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Product title" {...field} />
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
                        <Textarea
                          placeholder="Describe your product..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <CardStylePicker
                          onImageSelect={async (file: File) => {
                            const uploadedImage =
                              await handleUploadImageToSupabase(file);
                            form.setValue("image", uploadedImage?.path || "");
                          }}
                          defaultImage={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/teams/${slug}/products`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </TeamPageLayout>
  );
};

export default CreateTeamProduct;
