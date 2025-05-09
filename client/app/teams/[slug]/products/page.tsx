"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";
import { useQueryProducts } from "@/hooks/use-query-products";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Status } from "@/lib/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import ProductsTable from "./products-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AuthGuard from "@/guards/auth-guard";

const TeamPage = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);

  const params = useParams();
  const slug = params.slug;

  const getTeamQuery = useQueryTeam(slug as string);

  const getProductsQuery = useQueryProducts(
    getTeamQuery.data?.id as string,
    searchQuery,
    statusFilter,
    page
  );

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-background rounded-r-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="rounded-l-none"
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery(search)}
            >
              <Search />
            </Button>
          </div>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: Status | "all") => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] -ml-1.5 bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Statuses</SelectItem>
            <SelectItem value={Status.ACTIVE}>Active</SelectItem>
            <SelectItem value={Status.DRAFT}>Draft</SelectItem>
            <SelectItem value={Status.DELETED}>Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {getProductsQuery.isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <ProductsTable
                data={getProductsQuery.data?.products || []}
                teamId={getTeamQuery.data?.id as string}
              />
            </div>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {Array.from(
                  { length: getProductsQuery.data?.totalPages || 0 },
                  (_, i) => i + 1
                ).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <Button
                      variant={page === pageNumber ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === (getProductsQuery.data?.totalPages || 1)}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </TeamPageLayout>
  );
};

const GuardedTeamPage = () => {
  return (
    <AuthGuard>
      <TeamPage />
    </AuthGuard>
  );
};

export default GuardedTeamPage;
