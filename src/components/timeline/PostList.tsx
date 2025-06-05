import { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostItem from './PostItem';
import { Paginator } from 'primereact/paginator';
import { Search } from 'lucide-react';

const PostList = () => {
  // page offset
  const [first, setFirst] = useState(0);
  // rows per page
  const [rows, setRows] = useState(10);
  
  const currentPage = Math.floor(first / rows) + 1;
  const { data, isLoading, isError } = usePosts(currentPage, rows);

  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading) return <div className="text-center mt-4">Loading posts...</div>;
  if (isError || !data) return <div className="text-center mt-4 text-red-500">Failed to load posts.</div>;
  if (data.items.length === 0) return <div className="text-center mt-4">No post available.</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      {/* TOP Paginator */}
      <div className="w-full flex justify-end">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={data.totalItems}
          onPageChange={onPageChange}
          rowsPerPageOptions={[5, 10, 20, 50]}
          className="[&_.p-paginator]:justify-end"
          template={{ layout: 'PrevPageLink NextPageLink RowsPerPageDropdown JumpToPageInput' }}
          rightContent={<>
            <Search />
          </>}
        />
      </div>
      
      
      {/* POSTS */}
      {data.items.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
      
      {/* BOTTOM Paginator */}
      <div className="w-full flex justify-center mt-4">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={data.totalItems}
          onPageChange={onPageChange}
          rowsPerPageOptions={[5, 10, 20, 50]}
          template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink ' }}
        />
      </div>
    </div>
  );
};

export default PostList;