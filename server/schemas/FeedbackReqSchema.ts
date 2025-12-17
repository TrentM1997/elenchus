import { Type, Static } from "@sinclair/typebox";


const FeedbackReqSchema = Type.Object({

    email: Type.String(),
    message: Type.String()
});

type FeedbackReqSchemaType = Static<typeof FeedbackReqSchema>;

export { FeedbackReqSchema };

export type { FeedbackReqSchemaType };