import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
const UserSchema = Type.Object({
    user_id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' })
});
const user = {
    email: 'trentirvin51@gmail.com',
    password: 'Weezie1126!',
    user_id: '1223_98_9'
};
const validator = TypeCompiler.Compile(UserSchema);
const result = validator.Check(user);
console.log(result);
//# sourceMappingURL=index.js.map