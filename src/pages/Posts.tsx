import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { setToken, setUsername } from "../store/authSlice";
import { getPosts, createPost, updatePost } from "../services/postsService";
import type { Post } from "../types/post";
import { Dialog } from "primereact/dialog";
import PostForm, { type PostFormData } from "../components/PostForm";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state: RootState) => state.auth.username);

  const [posts, setPosts] = useState<Post[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    loadPosts();
  }, []);

  const handleLogout = () => {
    dispatch(setToken(""));
    dispatch(setUsername(""));
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleCreatePost = async (data: { title: string; body: string }) => {
    try {
      const newPost = await createPost(data);
      const completePost: Post = {
        ...newPost,
        tags: [],
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        views: 0,
      };
      setPosts((prev) => [completePost, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  const actionBodyTemplate = (rowData: Post) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => console.log("Ver", rowData.id)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="warning"
          onClick={() => {
            setSelectedPost(rowData);
            setVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => console.log("Eliminar", rowData.id)}
        />
      </div>
    );
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (!selectedPost) return;
    try {
      const updated = await updatePost(selectedPost.id, data);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === updated.id
            ? {
                ...post,
                ...updated,
              }
            : post,
        ),
      );
      setVisible(false);
      setSelectedPost(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h2>Bienvenido {username}</h2>
      <Toolbar
        className="mb-3"
        start={() => (
          <InputText
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        )}
        end={() => (
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            severity="success"
            onClick={() => setVisible(true)}
          />
        )}
      />

      <DataTable
        value={posts}
        paginator
        rows={10}
        stripedRows
        showGridlines
        responsiveLayout="scroll"
        globalFilter={globalFilter}
        globalFilterFields={["title", "body"]}
      >
        <Column field="id" header="ID" />
        <Column field="title" header="Título" />
        <Column field="userId" header="Usuario" />
        <Column
          header="Tags"
          body={(rowData: Post) => rowData.tags?.join(", ") ?? "-"}
        />
        <Column
          header="Likes"
          body={(rowData: Post) => rowData.reactions?.likes ?? 0}
        />
        <Column
          header="Dislikes"
          body={(rowData: Post) => rowData.reactions?.dislikes ?? 0}
        />
        <Column header="Vistas" body={(rowData: Post) => rowData.views ?? 0} />
        <Column header="Acciones" body={actionBodyTemplate} />
      </DataTable>
      <Dialog
        header="Nueva publicación"
        visible={visible}
        style={{ width: "40rem" }}
        onHide={() => setVisible(false)}
      >
        <PostForm
          initialData={
            selectedPost
              ? {
                  title: selectedPost.title,
                  body: selectedPost.body,
                }
              : undefined
          }
          onCancel={() => {
            setVisible(false);
            setSelectedPost(null);
          }}
          onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
        />
      </Dialog>

      <div className="mt-3">
        <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          severity="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Posts;
