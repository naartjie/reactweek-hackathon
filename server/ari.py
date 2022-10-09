import asyncio
from typing import Any, AsyncGenerator
from graphql import GraphQLResolveInfo
from ariadne import (
    ObjectType,
    SubscriptionType,
    make_executable_schema,
)
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLWSHandler


type_defs = """
    type Query {
        user: User
    }

    type User {
        username: String!
    }

    type Subscription {
        message: String!
        counter: Int!
    }
"""

query = ObjectType("Query")


@query.field("user")
def resolve_user(*_):
    return {}


user = ObjectType("User")


@user.field("username")
def resolve_username(obj, *_):
    return f"My name is {40 + 2}."


subscription = SubscriptionType()


@subscription.source("message")
@subscription.source("counter")
async def counter_generator(
    obj: Any, info: GraphQLResolveInfo
) -> AsyncGenerator[int, None]:
    for i in range(15):
        yield i
        await asyncio.sleep(0.5)


@subscription.field("message")
def message_resolver(count, info):
    return f"Hello, World {count + 1}"


@subscription.field("counter")
def counter_resolver(count, info):
    return count


schema = make_executable_schema(type_defs, query, user, subscription)
app = GraphQL(
    schema,
    websocket_handler=GraphQLWSHandler(),
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
