import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: alchemy-rpc, subgraphs, account-kit, enhanced-apis, webhooks-ops, pricing
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"alchemy-rpc", level:"beginner",
    q:"What is Alchemy primarily known for in the web3 developer market?",
    options:[
      "Multi-chain RPC infrastructure plus a developer platform suite",
      "A self-custody mobile wallet aimed at retail crypto traders",
      "An EVM L2 rollup focused on low-fee Ethereum scaling work",
      "A smart-contract security audit and verification firm only",
    ],
    answer:0,
    explain:"Alchemy markets itself as the complete web3 developer platform, anchored by Supernode RPC and a suite of products: Subgraphs, Account Kit, NFT API, Webhooks." },
  { id:"b2", topic:"alchemy-rpc", level:"beginner",
    q:"Which best describes Alchemy's chain coverage based on their public marketing?",
    options:[
      "Bitcoin mainnet and a small number of Ethereum testnets only",
      "Solana plus a handful of EVM-compatible Layer 2 rollup chains",
      "100+ chains spanning EVM, Solana, and additional non-EVM stacks",
      "Ethereum mainnet exclusively, with no other chain integrations",
    ],
    answer:2,
    explain:"Alchemy's pricing page advertises support across 100+ chains (EVM L1s, L2s, Solana, and more), with Enterprise SLAs available across the full surface." },
  { id:"b3", topic:"alchemy-rpc", level:"beginner",
    q:"What is an RPC endpoint, in plain product terms?",
    options:[
      "A URL your application calls to read or write blockchain data",
      "A mnemonic phrase used to unlock and recover a crypto wallet",
      "A specific smart-contract interface for token-transfer methods",
      "A consensus protocol used by validators to finalize new blocks",
    ],
    answer:0,
    explain:"An RPC (remote procedure call) endpoint is the URL that an application uses to query chain state or submit transactions. Alchemy's Supernode is one such endpoint." },
  { id:"b4", topic:"subgraphs", level:"beginner",
    q:"What problem does a subgraph solve for a typical web3 frontend?",
    options:[
      "It serves indexed and queryable on-chain data via GraphQL APIs",
      "It produces verifiable zero-knowledge proofs for privacy use cases",
      "It compiles Solidity smart contracts into deployable EVM bytecode",
      "It runs validator software that proposes and finalizes new blocks",
    ],
    answer:0,
    explain:"Subgraphs index on-chain events into structured data and expose them over GraphQL, replacing brittle eth_getLogs polling with a clean query layer." },
  { id:"b5", topic:"account-kit", level:"beginner",
    q:"What is the main idea behind ERC-4337 account abstraction?",
    options:[
      "Smart-contract wallets that can replace external EOA accounts",
      "A new chain-level fee market that fully replaces EIP-1559 logic",
      "An on-chain governance scheme used by major DAO protocols today",
      "A consensus-layer upgrade that switches Ethereum to proof of stake",
    ],
    answer:0,
    explain:"ERC-4337 enables smart-contract wallets (Smart Accounts) without changing the Ethereum protocol. Account Kit is Alchemy's SDK for building on top of it." },
  { id:"b6", topic:"enhanced-apis", level:"beginner",
    q:"Why do teams reach for Alchemy's NFT API instead of raw RPC calls?",
    options:[
      "It returns metadata, ownership, and floors in a single API call",
      "It guarantees a fixed lower gas fee for any minting transaction",
      "It runs a built-in royalty enforcement engine across marketplaces",
      "It performs visual similarity search on NFT artwork at query time",
    ],
    answer:0,
    explain:"NFT API consolidates ownership, metadata, and floor data that would otherwise require dozens of raw eth_call and tokenURI fetches per query." },
  { id:"b7", topic:"webhooks-ops", level:"beginner",
    q:"What does an Address Activity webhook from Alchemy Notify deliver?",
    options:[
      "Push events when a watched address sends or receives a transaction",
      "A signed cryptographic attestation about a wallet's complete history",
      "A daily emailed summary for one wallet, with no live event triggers",
      "An on-chain message that updates contract storage on every transfer",
    ],
    answer:0,
    explain:"Address Activity webhooks push a JSON payload to your endpoint whenever a watched address moves funds, replacing polling loops with real-time delivery." },
  { id:"b8", topic:"pricing", level:"beginner",
    q:"What is a Compute Unit (CU) in Alchemy's pricing model?",
    options:[
      "A weighted unit of cost assigned to each method based on its work",
      "A fixed flat fee charged for every individual API call uniformly",
      "A staking-related token that secures Alchemy's infrastructure layer",
      "A short-lived API session token issued to authenticate each request",
    ],
    answer:0,
    explain:"Different RPC methods do different amounts of node work, so Alchemy bills in Compute Units (CUs). For example, eth_call costs ~26 CU and eth_getLogs ~75 CU." },
  { id:"b9", topic:"pricing", level:"beginner",
    q:"What does Alchemy's free tier include, per their published pricing?",
    options:[
      "30M Compute Units per month and access to all standard endpoints",
      "Unlimited request volume across every chain Alchemy currently lists",
      "A perpetual free Enterprise plan with custom SLAs included always",
      "100 free requests per second across every supported chain at once",
    ],
    answer:0,
    explain:"Alchemy publishes a 30M Compute Units / month free tier with access to standard endpoints; usage above that point converts to Pay as you go." },
  { id:"b10", topic:"alchemy-rpc", level:"beginner",
    q:"What is 'polling' in the context of building against an RPC endpoint?",
    options:[
      "Calling the same method on a timer to detect new chain state",
      "Subscribing once and receiving server-pushed events on each block",
      "Running validator software to propose blocks for consensus rewards",
      "Submitting a signed write transaction that mutates contract storage",
    ],
    answer:0,
    explain:"Polling repeatedly hits a read method (like eth_getLogs) to check for changes. Webhooks and Subgraphs are the push-based alternatives Alchemy promotes." },
  { id:"b11", topic:"subgraphs", level:"beginner",
    q:"Which language is normally used to query a subgraph from a frontend client?",
    options:[
      "GraphQL, the query language the subgraph indexer exposes natively",
      "Plain SQL queries issued through a hosted relational database driver",
      "Vyper, the Pythonic smart-contract language used to author contracts",
      "REST URLs only, with no support for any structured query languages",
    ],
    answer:0,
    explain:"Subgraphs are queried with GraphQL. Alchemy hosts subgraphs and exposes them at a GraphQL endpoint that frontends and backends can query." },
  { id:"b12", topic:"account-kit", level:"beginner",
    q:"What is a Bundler in the ERC-4337 architecture?",
    options:[
      "A node that aggregates UserOperations into one on-chain transaction",
      "A wallet UI helper that bundles multiple end-user signing prompts",
      "A scaling sidechain that batches Layer 1 finality for L2 use cases",
      "A token-distribution contract used by airdrop programs at scale",
    ],
    answer:0,
    explain:"Bundlers collect UserOperations from a separate mempool and submit them in a single on-chain transaction via the EntryPoint contract. Alchemy operates a Bundler." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"alchemy-rpc", level:"intermediate",
    q:"What does Alchemy's Supernode add on top of a single Ethereum node?",
    options:[
      "Multi-region routing, load balancing, caching, plus failover handling",
      "A consensus-layer rewrite that finalizes blocks faster than baseline",
      "A new EVM opcode set offering lower per-operation gas fee outcomes",
      "An on-chain MEV auction engine that orders pending mempool inclusion",
    ],
    answer:0,
    explain:"Supernode is a load-balanced, cached, multi-region RPC layer that sits in front of nodes. It delivers consistent latency and uptime without exposing single-node failure." },
  { id:"i2", topic:"subgraphs", level:"intermediate",
    q:"Why do teams migrate hosted subgraphs to a paid hosting layer like Alchemy's?",
    options:[
      "The Graph hosted service is being deprecated for new deployments",
      "Hosted subgraphs cannot serve any production frontend traffic at all",
      "Self-hosted Graph Node is mandatory for every public chain network",
      "GraphQL is being removed from the protocol layer in coming releases",
    ],
    answer:0,
    explain:"The Graph deprecated the free hosted service. Teams need a hosting path; Alchemy and other providers operate paid Graph Node infrastructure to fill that gap." },
  { id:"i3", topic:"account-kit", level:"intermediate",
    q:"What is the role of a Paymaster in ERC-4337's UserOperation flow?",
    options:[
      "It sponsors gas fees on behalf of a user, enabling gasless dApp UX",
      "It signs UserOperations on behalf of users, so they avoid signing",
      "It charges the user a USD-pegged fee that bypasses the gas market",
      "It rate-limits how many UserOperations a single account may submit",
    ],
    answer:0,
    explain:"Paymasters can pay a UserOperation's gas, which is how dApps offer gasless or sponsored transactions. Alchemy's Gas Manager is a Paymaster service." },
  { id:"i4", topic:"enhanced-apis", level:"intermediate",
    q:"Which Alchemy enhanced API replaces a long sequence of eth_getLogs and eth_call paginated lookups?",
    options:[
      "alchemy_getAssetTransfers, which returns a chain history per address",
      "eth_subscribe, which only opens a WebSocket stream for new blocks",
      "eth_call directly, executed once for each historical block in range",
      "alchemy_minimalReorg, which detects historical reorganization events",
    ],
    answer:0,
    explain:"alchemy_getAssetTransfers returns the full transfer history for an address (ETH, ERC20, ERC721, ERC1155) in one call, replacing dozens of getLogs requests." },
  { id:"i5", topic:"webhooks-ops", level:"intermediate",
    q:"What does Alchemy's Reinforced Transactions service do?",
    options:[
      "It auto-bumps gas and resubmits transactions when one is stuck",
      "It rolls a transaction back if the resulting state proves unwanted",
      "It compresses a calldata payload before sending it to the mempool",
      "It posts the transaction across multiple chains for redundancy gain",
    ],
    answer:0,
    explain:"Reinforced Transactions automatically bumps gas and resubmits transactions that get stuck, so application code does not need bespoke mempool tracking logic." },
  { id:"i6", topic:"pricing", level:"intermediate",
    q:"What is Alchemy's published Pay as you go price for usage above the free CU tier?",
    options:[
      "Around $0.40 per 1M Compute Units, billed on monthly usage volume",
      "Always $1.00 per 1,000 RPC calls regardless of which method was used",
      "A flat $49 fee per month with unlimited Compute Units included free",
      "$10 per 1M requests with no method-by-method weighting at all here",
    ],
    answer:0,
    explain:"Alchemy's pricing page lists Pay as you go from $0.40 per 1M Compute Units. The Free tier includes 30M CUs / month before PAYG kicks in." },
  { id:"i7", topic:"alchemy-rpc", level:"intermediate",
    q:"What is the practical effect of eth_getLogs costing 75 CUs versus eth_call at 26?",
    options:[
      "Heavy log polling loops dominate CU bills more than typical reads",
      "Log queries always finish faster than equivalent eth_call requests",
      "Logs are unbillable, so teams should poll them as much as possible",
      "eth_call queries are entirely free under Alchemy's pricing approach",
    ],
    answer:0,
    explain:"eth_getLogs is significantly heavier per call. Teams polling logs for events often see it dominate their CU consumption versus replacing the loop with a webhook." },
  { id:"i8", topic:"subgraphs", level:"intermediate",
    q:"In Subgraph terms, what does a 'mapping' module written in AssemblyScript do?",
    options:[
      "Translates raw on-chain event data into the subgraph's stored schema",
      "Builds a website's user interface from a generic GraphQL schema file",
      "Compiles a Solidity contract directly into runnable EVM bytecode",
      "Defines block validators a subgraph chooses to trust during indexing",
    ],
    answer:0,
    explain:"Subgraph mappings (in AssemblyScript) consume raw events from the blockchain and write entities defined in schema.graphql, which is what GraphQL queries return." },
  { id:"i9", topic:"account-kit", level:"intermediate",
    q:"What is the EntryPoint contract in ERC-4337's design?",
    options:[
      "The single on-chain contract through which all UserOperations execute",
      "A registry of every smart wallet that the EVM has ever deployed yet",
      "A specific wallet UI library that simplifies user signing prompt UX",
      "An off-chain mempool service that orders pending UserOperations now",
    ],
    answer:0,
    explain:"EntryPoint is the canonical on-chain contract that processes UserOperations, calls the wallet, optionally calls a Paymaster, and handles the gas accounting flow." },
  { id:"i10", topic:"enhanced-apis", level:"intermediate",
    q:"What does the Token API's getTokenBalances method return for one wallet address?",
    options:[
      "All ERC20 balances held by a wallet across each requested token list",
      "Only the native ETH balance for a given wallet, no ERC20 balances",
      "The wallet's signed transaction history, sorted from newest to oldest",
      "The wallet's complete NFT inventory metadata, with no token balances",
    ],
    answer:0,
    explain:"alchemy_getTokenBalances returns the ERC20 token balances for an address in one call, replacing per-token eth_call(balanceOf) requests for an entire list." },
  { id:"i11", topic:"webhooks-ops", level:"intermediate",
    q:"Which webhook type fires when a transaction Alchemy was watching gets dropped from the mempool?",
    options:[
      "Dropped Transaction, which alerts when a tracked tx leaves the pool",
      "Mined Transaction, which fires only after a transaction is included",
      "Address Activity, which fires for any inbound or outbound movement",
      "Block Created, which is invoked for every new block on every chain",
    ],
    answer:0,
    explain:"Alchemy's Notify offers Mined Transaction, Dropped Transaction, and Address Activity webhooks. Dropped fires when a tracked transaction is evicted from the mempool." },
  { id:"i12", topic:"pricing", level:"intermediate",
    q:"What does the throughput add-on adjust on a Pay as you go account?",
    options:[
      "The peak requests-per-second ceiling above the default starting cap",
      "The total monthly CU allowance, by adding more bundled CU to plans",
      "The number of distinct apps the account is allowed to deploy at once",
      "The default page-size limit applied to alchemy_getAssetTransfers calls",
    ],
    answer:0,
    explain:"Pay as you go starts at 300 RPS by default. The throughput add-on lifts that ceiling so peak traffic does not get throttled at the worst possible moment." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"alchemy-rpc", level:"expert",
    q:"How does Supernode typically reduce p99 latency variance versus a single node?",
    options:[
      "It routes between nodes via health checks, so slow ones get bypassed",
      "It modifies the EVM directly to execute opcodes more quickly per call",
      "It batches user requests on chain to share the cost of finalization",
      "It always responds from a write-through cache without any node hits",
    ],
    answer:0,
    explain:"Supernode runs many nodes behind a load balancer that routes around degraded backends. The big p99 win comes from avoiding any single slow node on hot paths." },
  { id:"e2", topic:"subgraphs", level:"expert",
    q:"What's the practical risk of relying on a 'pending' subgraph deployment in production?",
    options:[
      "Pending deployments are not yet synced and queries can return stale",
      "Pending subgraphs charge double the standard per-query rate as fees",
      "The Graph protocol blocks pending subgraphs from any GraphQL queries",
      "Pending deployments cannot be queried over a normal HTTPS connection",
    ],
    answer:0,
    explain:"A pending subgraph version is still indexing. Querying it returns possibly-stale or partial data; production traffic should hit the synced current version instead." },
  { id:"e3", topic:"account-kit", level:"expert",
    q:"Why does ERC-4337 use a separate UserOperation mempool from the regular tx mempool?",
    options:[
      "UserOperations have different validation rules than regular transactions",
      "Validators refuse to look at any pending standard mempool transactions",
      "Account abstraction wallets sign valid Ethereum transactions natively",
      "Bundlers are forced to broadcast each UserOperation to every chain at once",
    ],
    answer:0,
    explain:"UserOperations carry validation logic that an EOA tx does not. They live in a separate alt-mempool until a Bundler picks them up and submits a real tx to EntryPoint." },
  { id:"e4", topic:"enhanced-apis", level:"expert",
    q:"For high-volume NFT galleries, why is alchemy_getNFTs preferred over per-token eth_call(tokenURI)?",
    options:[
      "It batches metadata, ownership, and media URLs in one paginated reply",
      "It signs NFT mints on behalf of users, removing every gas requirement",
      "It permanently caches every NFT image on chain via decentralized storage",
      "It enforces ERC-2981 royalty splits on each marketplace transaction now",
    ],
    answer:0,
    explain:"alchemy_getNFTs returns metadata, ownership, and media URLs in one paginated call. The cost-per-call is higher, but it replaces dozens of raw RPC requests per page." },
  { id:"e5", topic:"webhooks-ops", level:"expert",
    q:"What is the canonical way to verify that a webhook payload truly came from Alchemy?",
    options:[
      "Validate the X-Alchemy-Signature header against your signing secret",
      "Trust the source IP entirely, since Alchemy uses fixed static IP ranges",
      "Skip verification on TLS-terminated traffic, since TLS is enough alone",
      "Check the timestamp field exclusively for any payload accepted today",
    ],
    answer:0,
    explain:"Each webhook delivery includes an X-Alchemy-Signature HMAC. Verify it against your signing secret on the server before trusting the payload, just like Stripe webhooks." },
  { id:"e6", topic:"pricing", level:"expert",
    q:"Why does debug_traceTransaction at ~309 CUs reshape a team's bill at scale?",
    options:[
      "It costs roughly 12x a basic eth_call, so usage adds up quickly",
      "It is the cheapest method available, since it only returns a hash",
      "It caches results per block, so repeated calls become entirely free",
      "It bundles 100 separate API calls into one cheap composite request",
    ],
    answer:0,
    explain:"debug_traceTransaction is one of the heaviest standard methods. Production debugging or fraud-detection paths that call it often dominate the CU bill versus normal reads." },
  { id:"e7", topic:"alchemy-rpc", level:"expert",
    q:"When does a 429 response on Alchemy typically not mean 'spend more on plan'?",
    options:[
      "When peak RPS hits the throughput cap but monthly CUs remain inside",
      "When the request volume has consumed every Compute Unit for the cycle",
      "When an account is permanently banned for terms-of-service violations",
      "When the chain itself is down and no provider could service requests",
    ],
    answer:0,
    explain:"429s come from per-second throughput caps, not just monthly CU limits. A throughput add-on (lifting the RPS ceiling) is often the cheaper fix versus a higher tier." },
  { id:"e8", topic:"subgraphs", level:"expert",
    q:"Why is a subgraph's reorg handling logic important for indexers in production?",
    options:[
      "Without it, reverted blocks leave stale entities in the indexed dataset",
      "Without it, subgraphs cannot serve any GraphQL traffic to clients at all",
      "Reorg handling controls the gas cost of every on-chain write event",
      "It dictates which validators a subgraph indexer will trust over time",
    ],
    answer:0,
    explain:"Reorgs roll back recent blocks. Subgraphs handle reorgs by reverting affected entities; without that logic, the indexed dataset diverges from canonical chain state." },
  { id:"e9", topic:"account-kit", level:"expert",
    q:"What is a 'session key' in the context of smart-account UX patterns?",
    options:[
      "A scoped key that signs a limited set of actions for a finite period",
      "The seed phrase used to back up an externally owned account's funds",
      "A protocol-level cryptographic key shared by every node in a network",
      "A short-lived API token that authenticates an Alchemy RPC connection",
    ],
    answer:0,
    explain:"Session keys are scoped, time-bound signing keys on a smart account. They power gameplay, sub-accounts, and signless flows without exposing the master key." },
  { id:"e10", topic:"enhanced-apis", level:"expert",
    q:"How do Alchemy's enhanced APIs actually serve queries faster than raw archive nodes?",
    options:[
      "They precompute and index the answer offline, separate from chain state",
      "They run the query inside the EVM at sub-millisecond execution speed",
      "They issue a new on-chain transaction per query to fetch fresh state",
      "They modify the underlying node binary so RPC calls bypass disk reads",
    ],
    answer:0,
    explain:"Methods like getAssetTransfers and getNFTs are answered by Alchemy's offline-indexed datasets. The RPC interface is preserved; the data path is a side index." },
  { id:"e11", topic:"webhooks-ops", level:"expert",
    q:"Why do production webhook consumers usually need an idempotency strategy?",
    options:[
      "Webhooks can be redelivered, so handlers must dedupe by event ID",
      "Webhooks always arrive exactly once, so dedupe logic is unnecessary",
      "Webhooks fire only on the very first matching event in a long history",
      "Webhooks include a built-in lock that prevents any duplicate processing",
    ],
    answer:0,
    explain:"Webhook providers (including Alchemy) retry on 5xx or timeouts. Consumers dedupe by event ID or transaction hash to avoid double-processing the same delivery." },
  { id:"e12", topic:"pricing", level:"expert",
    q:"At what scale does Alchemy's Enterprise tier usually start to win versus Pay as you go?",
    options:[
      "When monthly CU consumption reaches the high hundreds of millions",
      "When a team uses fewer than 1M Compute Units in a typical month",
      "When the account is on a free tier that has zero usage activity",
      "When only one chain is in scope and traffic stays purely read-only",
    ],
    answer:0,
    explain:"Enterprise unit economics typically improve at 500M+ CUs, especially for teams that need custom SLAs, dedicated support, and reserved throughput across many chains." },
];

const TOPIC_LABEL: Record<string, string> = {
  "alchemy-rpc": "Supernode RPC architecture",
  subgraphs: "Subgraphs and indexing",
  "account-kit": "Account Kit and ERC-4337",
  "enhanced-apis": "NFT, Token and Transfers APIs",
  "webhooks-ops": "Webhooks and ops services",
  pricing: "Compute Units and plans",
};

function shuffle<T>(a: T[]): T[] { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample<T>(a: T[], n: number): T[] { return shuffle(a).slice(0, n); }

function shuffleQuestions(questions: any[]) {
  const positionCounts = [0, 0, 0, 0];
  const recentPositions: number[] = [];
  return questions.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_: any, i: number) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter((p) => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function pickQuestions(level: string, n: number) {
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const i = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(i, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  const pool = BANK.filter(q => q.level === level);
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function App() {
  const [length, setLength] = useState<number>(10);
  const [level, setLevel] = useState<string>("beginner");
  const [stage, setStage] = useState<"setup"|"run"|"done">("setup");
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done");
  };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Alchemy Platform & Web3 Dev Quiz");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== "expert" ? "mixed" : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  • ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: any; set: (v: any) => void; options: { value: any; label: string }[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={String(o.value)} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
            <span className="wordmark">Alchemy</span>
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">A quiz · DevRel, sales enablement, partner education</div>
        <h1>Alchemy Platform & Web3 Dev Quiz</h1>
        <p className="lede">A short, polite test of how well you know Alchemy's product surface (Supernode RPC, Subgraphs, Account Kit, NFT and Token APIs, Webhooks, Reinforced Transactions) and the broader web3 dev concepts they sit on. Drawn from Alchemy's public docs and pricing page.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>

        <div className="footer-note">
          Alchemy-specific detail comes directly from Alchemy's public documentation (Supernode, Subgraphs, Account Kit, NFT and Token APIs, Webhooks, Reinforced Transactions, Compute Unit table). Broader questions cover ERC-4337, GraphQL, and standard RPC concepts. No data is collected.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
            <span className="wordmark">Alchemy</span>
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt: string, i: number) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>Restart</button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on Alchemy and modern web3 dev." :
    pct >= 70 ? "Solid working understanding of Alchemy's surface." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead." :
    "Plenty of room to learn. Alchemy's docs are a good next stop.";

  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
        >
          <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          <span className="wordmark">Alchemy</span>
        </a>
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "var(--muted)" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>

      <div className="footer-note">Alchemy-specific detail is sourced from Alchemy's public documentation, blog, and pricing page. Broader web3 dev questions cover ERC-4337 standards, GraphQL, and standard RPC concepts. Independent tool, not affiliated with Alchemy.</div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
