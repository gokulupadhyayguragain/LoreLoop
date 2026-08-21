# Weekend Creative Agent Challenge: LoreLoop

> Draft for the Builder Center article. Replace the TODO links and screenshot placeholders after deployment.

## What I built

LoreLoop is an autonomous worldbuilding agent that maintains one fictional universe. It wakes itself on a schedule, reads the canon it has already created, decides which part of the world needs to develop next, writes a new entry, validates that entry, creates artwork when enabled, and publishes the result. The important part is that the generation does not begin with a person opening a page or submitting a prompt.

**Screenshot placeholder:** LoreLoop homepage showing Agent Online and the latest autonomous generation.

## How the loop works

Each scheduled run starts with a run record. LoreLoop loads a compact world state from DynamoDB — the current era, major locations, characters, factions, recent events, dominant themes, and unresolved mysteries — along with the latest lore entries. A small analysis step gives the model development guidance so it does not keep choosing the same entity type.

Amazon Bedrock Nova receives that context and returns a structured lore draft. The Lambda validates the draft with Zod, repairs malformed JSON once when necessary, and sends the proposed entry through a second lightweight canon check. A major conflict triggers one correction attempt; the workflow never loops indefinitely. Stable Image Core creates a matching visual and the Lambda stores it in a private S3 bucket.

The final lore entry and its relationships are stored in DynamoDB. The world state is updated for the next run. CloudWatch receives structured events, and the public activity page reads those stored run events so the autonomous behavior can be inspected rather than implied by a loading animation.

I also added a Curator layer. A visitor can send a question, a thread, or a mood to the archive. That signal is stored in DynamoDB and passed as optional context to a future awakening. It does not trigger an instant generation, so the user can participate without turning the product back into a prompt box. The visitor becomes part of the world loop while LoreLoop remains responsible for deciding what becomes canon.

**Screenshot placeholder:** CloudWatch logs showing one complete scheduled execution.

## AWS architecture

The heartbeat is Amazon EventBridge Scheduler. AWS Lambda owns the orchestration. Amazon Bedrock provides the creative and validation models. DynamoDB is the persistent memory layer, S3 stores artwork, CloudWatch provides operational evidence, and API Gateway exposes only read-only GET routes to the Next.js frontend.

I used AWS SAM as the single infrastructure system. The template provisions the table, private bucket, Lambda functions, API, scheduler, and least-privilege roles in one deployable stack.

**Screenshot placeholder:** Architecture diagram and EventBridge Scheduler configuration.

## What I learned

The main design challenge was resisting the temptation to treat memory as a long prompt. A compact state record is more useful for the recurring workflow: it preserves the facts that matter for the next decision while recent lore supplies texture. I also found that “canon aware” does not need to mean a perfect consistency engine for a weekend project. A bounded validation pass catches major contradictions, leaves ambiguity alone, and keeps the agent creative.

The other practical lesson was to treat failure as partial. If the text generation succeeds but the image call fails, the world should still move forward. LoreLoop stores the story with a partial status and keeps the archive readable.

The production deployment uses the active Stable Image Core model in us-west-2. Artwork is generated once for each lore entry, stored privately in S3, and exposed to the public archive through temporary signed links from the API. The text agent, memory layer, scheduler, validation, API, image layer, and public archive are all active.

## Links

Live application: https://main.dtzolh2gx99cy.amplifyapp.com/

GitHub repository: https://github.com/gokulupadhyayguragain/LoreLoop
