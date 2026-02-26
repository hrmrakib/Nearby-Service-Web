import baseAPI, { TList } from "@/redux/api/api";

const chatAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      keepUnusedDataFor: 0,
      query: ({
        page,
        limit,
        search,
        chat_id,
      }: TList & {
        chat_id: string;
      }) => {
        const query = new URLSearchParams({
          chat_id,
        });

        if (page) query.set("page", page.toString());
        if (limit) query.set("limit", limit.toString());
        if (search) query.set("search", search);

        return {
          url: `/chat/inbox/${chat_id}?${query.toString()}`,
        };
      },
    }),

    getInboxChats: builder.query({
      keepUnusedDataFor: 0,
      query: ({
        page,
        limit,
        search,
        unread,
      }: TList & { unread?: boolean }) => {
        const query = new URLSearchParams({});

        if (page) query.set("page", page.toString());
        if (limit) query.set("limit", limit.toString());
        if (search) query.set("search", search);
        // if (unread) query.set("unread", unread.toString());

        return {
          url: `/chat?${query.toString()}`,
        };
      },
    }),

    newChat: builder.mutation({
      query: (data: { member: string }) => ({
        url: `/chat/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetInboxChatsQuery,
  useNewChatMutation,
} = chatAPI;
export default chatAPI;
