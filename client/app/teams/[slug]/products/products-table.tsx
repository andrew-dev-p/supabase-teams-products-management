import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/ui/delete-dialog";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Product, Status } from "@/lib/entities";
import { statusToColorsMap } from "@/lib/utils";
import { MoreHorizontal, Edit, Notebook, Check, Trash } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutateProducts } from "@/hooks/use-mutate-products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProductDialog from "./edit-product-dialog";

const ProductsTable = ({
  data,
  teamId,
}: {
  data: Product[];
  teamId: string;
}) => {
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [editDialogId, setEditDialogId] = useState<string | null>(null);

  const { updateProductMutation, setProductDeletedMutation } =
    useMutateProducts(teamId);

  return (
    <Table className="bg-background rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((product) => (
          <React.Fragment key={product.id}>
            <DeleteDialog
              title="Delete product"
              description="Are you sure you want to set this product as deleted? It will be completely deleted from the database in 2 days."
              isOpen={deleteDialogId === product.id}
              onClose={() => setDeleteDialogId(null)}
              onDelete={() => {
                setProductDeletedMutation.mutate(product.id);
                setDeleteDialogId(null);
              }}
            />
            <EditProductDialog
              isOpen={editDialogId === product.id}
              onClose={() => setEditDialogId(null)}
              product={product}
              onEdit={(data) => {
                updateProductMutation.mutate({
                  id: product.id,
                  title: data.title,
                  description: data.description,
                  picture: data.picture,
                });
                setEditDialogId(null);
              }}
            />
            <TableRow>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  {product.picture ? (
                    <Image
                      src={product.picture}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-neutral-300 h-full w-full rounded-md" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                {product.description}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${statusToColorsMap[product.status]} text-white`}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      {product.status !== Status.ACTIVE && (
                        <DropdownMenuItem
                          onClick={() => {
                            setEditDialogId(product.id);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit properties
                        </DropdownMenuItem>
                      )}
                      {(product.status === Status.ACTIVE ||
                        product.status === Status.DELETED) && (
                        <DropdownMenuItem
                          onClick={() => {
                            updateProductMutation.mutate({
                              id: product.id,
                              status: Status.DRAFT,
                            });
                          }}
                        >
                          <Notebook className="mr-2 h-4 w-4" />
                          Set as Draft
                        </DropdownMenuItem>
                      )}
                      {(product.status === Status.DRAFT ||
                        product.status === Status.DELETED) && (
                        <DropdownMenuItem
                          onClick={() => {
                            updateProductMutation.mutate({
                              id: product.id,
                              status: Status.ACTIVE,
                            });
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Set as Active
                        </DropdownMenuItem>
                      )}
                      {(product.status === Status.DRAFT ||
                        product.status === Status.ACTIVE) && (
                        <DropdownMenuItem
                          onClick={() => setDeleteDialogId(product.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Set as Deleted
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
