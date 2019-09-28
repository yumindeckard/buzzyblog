import React, { useContext, useEffect, useState } from "react";
import PostContext from "@/contexts/PostContext";
import { getMetas } from "@/apis/metas";
import { getPosts } from "@/apis/posts";

const SideBar = (props) => {
    const { postContext } = useContext(PostContext);

    const [categories, setCategories] = useState([]);
    const initCategories = async () => {
        let resp = await getMetas("categories");
        let categories = resp.status === 200 ? resp.data : [];
        setCategories(categories);
    };

    useEffect(() => {
        initCategories();
    }, []);
    // console.log(categories);

    const handlePostOnClick = (post) => {
        const { id, slug } = post;
        let url = `${id}-${slug.split(" ").join("_")}.html`;
        props.history.push({
            pathname: `/post/${url}`,
            state: { post: post },
        });
    };

    const handleCategoryOnClick = async ({ id, slug }) => {
        let resp = await getPosts({ category_id: id });
        // console.log(resp);
        let posts = resp.status == 200 ? [...resp.data] : [];
        props.history.push({
            pathname: `/category/${slug.split(" ").join("_")}`,
            state: { posts: posts },
        });
    };

    return (
        <aside className="menu">
            <p className="menu-label">Categories</p>
            <ul className="menu-list">
                <li onClick={() => handleCategoryOnClick({ id: 0, slug: "all" })}>
                    <a>All Categories</a>
                </li>
                {categories.map((c) => {
                    return (
                        <li key={c.id} onClick={() => handleCategoryOnClick(c)}>
                            <a>{c.name}</a>
                        </li>
                    );
                })}
            </ul>
            <p className="menu-label is-hidden-mobile">Pinned Posts</p>
            <ul className="menu-list is-hidden-mobile">
                {postContext.pinned.length ? (
                    postContext.pinned.map((post) => {
                        return (
                            <li key={post.id} onClick={() => handlePostOnClick(post)}>
                                <a>{post.title.rendered}</a>
                            </li>
                        );
                    })
                ) : (
                    <li>
                        <a>No Pinned Posts Yet</a>
                    </li>
                )}
            </ul>
        </aside>
    );
};

export default SideBar;