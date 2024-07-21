import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';

interface PostFilteringProps {
  handleFilter: (value: string) => void;
}
function PostFiltering({ handleFilter }: PostFilteringProps) {
  return (
    <div className="flex items-center justify-normal gap-6">
      <Select name="filterPost" required onValueChange={handleFilter} defaultValue={'true'}>
        <SelectTrigger className="w-[148px]">
          <SelectValue placeholder="Trier par date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Croissant</SelectItem>
          <SelectItem value="false">Décroissant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default PostFiltering;
