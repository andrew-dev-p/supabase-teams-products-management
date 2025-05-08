"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";
import { useQueryProducts } from "@/hooks/use-query-products";
import { ProductCard } from "@/components/product-card";
import {
  Check,
  Edit,
  MoreHorizontal,
  Notebook,
  Package,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Status } from "@/lib/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { statusToColorsMap } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const TeamPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [createDateFilter, setCreateDateFilter] = useState<string | null>(null);
  const [createdByFilter, setCreatedByFilter] = useState<string | null>(null);

  const params = useParams();
  const slug = params.slug;

  const getTeamQuery = useQueryTeam(slug as string);

  const getProductsQuery = useQueryProducts(getTeamQuery.data?.id as string);

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter(Status.ACTIVE)}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(Status.DRAFT)}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter(Status.DELETED)}
                >
                  Archived
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Select
          value={statusFilter || undefined}
          onValueChange={(value: Status) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] -ml-1.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {getProductsQuery.data && getProductsQuery.data.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getProductsQuery.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={product.picture || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/products/${product.id}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusToColorsMap[product.status]
                      } text-white`}
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit properties
                          </DropdownMenuItem>
                          {(product.status === Status.ACTIVE ||
                            product.status === Status.DELETED) && (
                            <DropdownMenuItem>
                              <Notebook className="mr-2 h-4 w-4" />
                              Set as Draft
                            </DropdownMenuItem>
                          )}
                          {(product.status === Status.DRAFT ||
                            product.status === Status.DELETED) && (
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Set as Active
                            </DropdownMenuItem>
                          )}
                          {(product.status === Status.DRAFT ||
                            product.status === Status.ACTIVE) && (
                            <DropdownMenuItem>
                              <Trash className="mr-2 h-4 w-4" />
                              Set as Deleted
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
              {search
                ? "No products match your search criteria."
                : "Get started by creating a new product."}
            </p>
            <Link href={`/teams/${slug}/products/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </TeamPageLayout>
  );
};

export default TeamPage;
