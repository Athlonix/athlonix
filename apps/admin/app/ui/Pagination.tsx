import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/ui/pagination';
import React from 'react';

interface Props {
  page: number;
  maxPage: number;
  href: string;
  params?: string;
}

function PaginationComponent(props: Props): JSX.Element {
  return (
    <Pagination>
      <PaginationContent>
        {props.page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page - 1}${props.params ? props.params : ''}`}
            />
          </PaginationItem>
        )}
        {props.page > 3 && (
          <PaginationItem>
            <PaginationLink
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page - 2}${props.params ? props.params : ''}`}
            >
              {props.page - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {props.page > 2 && (
          <PaginationItem>
            <PaginationLink
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page - 1}${props.params ? props.params : ''}`}
            >
              {props.page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            className="border border-gray-500 rounded-lg"
            href={`${props.href}?page=${props.page}${props.params ? props.params : ''}`}
            isActive
          >
            {props.page}
          </PaginationLink>
        </PaginationItem>
        {props.page < props.maxPage && (
          <PaginationItem>
            <PaginationLink
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page + 1}${props.params ? props.params : ''}`}
            >
              {props.page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {props.page < props.maxPage - 1 && (
          <PaginationItem>
            <PaginationLink
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page + 2}${props.params ? props.params : ''}`}
            >
              {props.page + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {props.page < props.maxPage && (
          <PaginationItem>
            <PaginationNext
              className="border border-gray-500 rounded-lg"
              href={`${props.href}?page=${props.page + 1}${props.params ? props.params : ''}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
