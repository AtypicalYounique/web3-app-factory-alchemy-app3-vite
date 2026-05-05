import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: alchemy-rpc, subgraphs, account-kit, enhanced-apis, webhooks-ops, pricing
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"Who are the two co-founders of Alchemy?",
    options:[
      "Nikil Viswanathan and Joe Lau, who met at Stanford CS",
      "Vitalik Buterin and Gavin Wood, of Ethereum and Polkadot",
      "Brian Armstrong and Fred Ehrsam, of the Coinbase exchange",
      "Sergey Nazarov and Steve Ellis, of the Chainlink protocol",
    ],
    answer:0,
    explain:"Per Alchemy's company page, Nikil Viswanathan (CEO) and Joe Lau (President) co-founded Alchemy. Both hold BS and MS in Computer Science from Stanford." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"In what year was Alchemy founded?",
    options:[
      "2017, with the team going through Y Combinator that summer",
      "2014, around the same window the Ethereum mainnet launched",
      "2019, the same year their Series A funding round was closed",
      "2021, the same year their Series B round at Coatue closed",
    ],
    answer:0,
    explain:"Alchemy was founded in 2017 in San Francisco, per the LinkedIn profile of CEO Nikil Viswanathan and the YC S17 batch listing. Wired confirmed the timing in its 2019 profile." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"Where is Alchemy headquartered?",
    options:[
      "San Francisco, California, in the United States today",
      "New York, New York, with an office focused on fintech",
      "Zug, Switzerland, in the so-called Crypto Valley region",
      "Singapore, with a regional focus on Asia-Pacific markets",
    ],
    answer:0,
    explain:"Alchemy is headquartered in San Francisco, per the company's LinkedIn page and Built In SF listing. The team has been SF-based since founding in 2017." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"Which startup accelerator did Alchemy go through?",
    options:[
      "Y Combinator, in the Summer 2017 (S17) batch cohort",
      "Techstars, in their dedicated blockchain-focused track",
      "500 Startups, during one of their global accelerator runs",
      "ConsenSys Mesh, their early Ethereum incubator program",
    ],
    answer:0,
    explain:"Alchemy is a Y Combinator alum from the Summer 2017 batch, listed in the official YCDB S17 directory and YC's Summer 2017 stats blog post." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"What is a common nickname used to describe Alchemy in the press?",
    options:[
      "The 'AWS of Web3', for its developer infrastructure focus",
      "The 'Stripe of Web3', for its payment-rails-first approach",
      "The 'Shopify of Web3', for its no-code merchant tooling",
      "The 'Twilio of Web3', for SMS and voice messaging APIs",
    ],
    answer:0,
    explain:"TechCrunch's 2021 Series B headline called Alchemy the 'AWS for blockchain', and outlets like SiliconAngle and eco.com use 'AWS of Web3' for the same reason: it abstracts node ops." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is Alchemy's flagship RPC product called?",
    options:[
      "Supernode, a load-balanced multi-region RPC service",
      "Hypernode, a self-hosted single-binary RPC daemon",
      "Skynode, a peer-to-peer mesh of validator endpoints",
      "Megabase, a relational database backing every chain",
    ],
    answer:0,
    explain:"Supernode is Alchemy's flagship RPC product. It is a load-balanced, cached, multi-region RPC layer in front of nodes, delivering consistent latency and uptime." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"How many chains does Alchemy's pricing page advertise support across?",
    options:[
      "100+ chains, spanning EVM L1s, L2s, Solana, and others",
      "Two chains only, namely Ethereum and Polygon mainnet",
      "Bitcoin mainnet plus a small set of Ethereum testnets",
      "Only EVM chains, with no support for any non-EVM stack",
    ],
    answer:0,
    explain:"Alchemy markets support across 100+ chains on its pricing and product pages, including Ethereum, L2 rollups, Solana, and other non-EVM stacks." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"Why do teams reach for Alchemy's NFT API instead of raw RPC calls?",
    options:[
      "It returns metadata, ownership, and floors in one API call",
      "It guarantees a fixed lower gas fee for every mint transaction",
      "It runs a built-in royalty enforcement engine for marketplaces",
      "It performs visual similarity search on artwork at query time",
    ],
    answer:0,
    explain:"NFT API consolidates ownership, metadata, and floor data that would otherwise require dozens of raw eth_call and tokenURI fetches per query." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"What is a Compute Unit (CU) in Alchemy's pricing model?",
    options:[
      "A weighted unit of cost assigned per method based on its work",
      "A fixed flat fee charged for every individual API call uniformly",
      "A staking-related token that secures Alchemy's infrastructure layer",
      "A short-lived API session token issued to authenticate each request",
    ],
    answer:0,
    explain:"Different RPC methods do different amounts of node work, so Alchemy bills in Compute Units (CUs). For example, eth_call costs ~26 CU and eth_getLogs ~75 CU." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What does Alchemy's free tier include, per their published pricing?",
    options:[
      "30M Compute Units per month and access to standard endpoints",
      "Unlimited request volume across every chain Alchemy currently lists",
      "A perpetual free Enterprise plan with custom SLAs included always",
      "100 free requests per second across each supported chain together",
    ],
    answer:0,
    explain:"Alchemy publishes a 30M Compute Units / month free tier with access to standard endpoints; usage above that point converts to Pay as you go." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What is an RPC endpoint, in plain product terms?",
    options:[
      "A URL your application calls to read or write blockchain data",
      "A mnemonic phrase used to unlock and recover a crypto wallet",
      "A specific smart-contract interface for token-transfer methods",
      "A consensus protocol used by validators to finalize new blocks",
    ],
    answer:0,
    explain:"An RPC (remote procedure call) endpoint is the URL that an application uses to query chain state or submit transactions. Alchemy's Supernode is one such endpoint." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What is the main idea behind ERC-4337 account abstraction?",
    options:[
      "Smart-contract wallets that can replace external EOA accounts",
      "A new chain-level fee market that fully replaces EIP-1559 logic",
      "An on-chain governance scheme used by major DAO protocols today",
      "A consensus-layer upgrade that moves Ethereum to proof of stake",
    ],
    answer:0,
    explain:"ERC-4337 enables smart-contract wallets (Smart Accounts) without changing the Ethereum protocol. Account Kit is Alchemy's SDK for building on top of it." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"How much did Alchemy raise in its Series B round, and who led it?",
    options:[
      "$80M in April 2021, led by Coatue and Lee Fixel's Addition",
      "$30M in March 2020, led by Andreessen Horowitz exclusively",
      "$120M in June 2021, led by Sequoia Capital and Tiger Global",
      "$50M in October 2020, led by Paradigm and Polychain Capital",
    ],
    answer:0,
    explain:"Alchemy's Series B closed April 28, 2021, at $80M led by Coatue and Addition (Lee Fixel's fund), valuing the company at $505M. Reported by PR Newswire and TechCrunch." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"At what valuation did Alchemy's Series C round in October 2021 close?",
    options:[
      "$3.5B, on a $250M Series C round led by Andreessen Horowitz",
      "$1.2B, on a $90M Series C round led by Founders Fund alone",
      "$7.0B, on a $400M Series C round led by Tiger Global Management",
      "$500M, on a $80M Series C round led by Coatue and Addition",
    ],
    answer:0,
    explain:"Alchemy's Series C in October 2021 raised $250M at a $3.5B valuation, led by a16z, with Lightspeed and Redpoint joining as new investors. Confirmed by Alchemy's press release." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"What was Alchemy's first acquisition?",
    options:[
      "ChainShot, an Ethereum developer education bootcamp, in 2022",
      "The Graph, the protocol behind decentralized GraphQL indexers",
      "Etherscan, the major block explorer for Ethereum mainnet today",
      "Infura, a competing RPC provider that Alchemy bought outright",
    ],
    answer:0,
    explain:"Alchemy's blog post titled 'Alchemy Acquires ChainShot for Web3 Developer Education' (Aug 2022) confirms ChainShot as the company's first acquisition." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"Which group of named customers does Alchemy's company page advertise?",
    options:[
      "JP Morgan, Robinhood, Visa, Stripe, and Polymarket as customers",
      "Apple, Microsoft, IBM, Oracle, and Salesforce as named customers",
      "Goldman Sachs, Citi, HSBC, BNP, and Deutsche Bank as customers",
      "Walmart, Target, Costco, Kroger, and Amazon as named customers",
    ],
    answer:0,
    explain:"Alchemy's company page lists 'JP Morgan, Robinhood, Visa, Stripe, Polymarket, and many others' as foundational crypto infrastructure customers." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"What is Alchemy's stated mission?",
    options:[
      "Bring blockchain to a billion people via developer infrastructure",
      "Replace the current global SWIFT network with on-chain settlement",
      "Tokenize every public equity on a single shared exchange ledger",
      "Operate the largest validator set on every proof-of-stake chain",
    ],
    answer:0,
    explain:"Alchemy publicly states the goal of bringing blockchain (or web3) to a billion people, repeated on the company page and in the ChainShot acquisition blog post." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"What does Supernode add on top of a single Ethereum node?",
    options:[
      "Multi-region routing, load balancing, caching, and failover handling",
      "A consensus-layer rewrite that finalizes blocks faster than baseline",
      "A new EVM opcode set offering lower per-operation gas fee outcomes",
      "An on-chain MEV auction engine that orders pending mempool inclusion",
    ],
    answer:0,
    explain:"Supernode is a load-balanced, cached, multi-region RPC layer that sits in front of nodes. It delivers consistent latency and uptime without exposing single-node failure." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"What does Alchemy Subgraphs actually host for a customer team?",
    options:[
      "Graph Node infrastructure that indexes events to a GraphQL API",
      "A relational Postgres database holding raw on-chain transactions",
      "A staking pool that earns block rewards on any indexed network",
      "A Tendermint validator set that finalizes blocks for the customer",
    ],
    answer:0,
    explain:"Alchemy Subgraphs hosts Graph Node infrastructure: customer mappings index on-chain events into entities exposed over a GraphQL endpoint, replacing the deprecated free hosted service." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"What is Alchemy's Gas Manager designed to do?",
    options:[
      "Act as an ERC-4337 Paymaster sponsoring user transaction gas",
      "Predict the next base fee on EIP-1559 chains for a wallet UI",
      "Lock gas at a fixed USD price across every supported chain at once",
      "Mint a custom gas token a dApp uses for internal accounting needs",
    ],
    answer:0,
    explain:"Alchemy's Gas Manager is a Paymaster service for ERC-4337 accounts: it pays UserOperation gas on behalf of users, enabling gasless or sponsored transaction flows." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"Which Alchemy enhanced API replaces long sequences of eth_getLogs calls?",
    options:[
      "alchemy_getAssetTransfers, returning a transfer history per address",
      "eth_subscribe, which only opens a WebSocket stream for new blocks",
      "eth_call directly, executed once for each historical block in range",
      "alchemy_minimalReorg, which detects historical reorganization events",
    ],
    answer:0,
    explain:"alchemy_getAssetTransfers returns the full transfer history for an address (ETH, ERC20, ERC721, ERC1155) in one call, replacing dozens of getLogs requests." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"What is Alchemy's Pay as you go price for usage above the free CU tier?",
    options:[
      "From $0.40 per 1M Compute Units, billed on monthly usage volume",
      "Always $1.00 per 1,000 RPC calls regardless of which method was used",
      "A flat $49 fee per month with unlimited Compute Units included free",
      "$10 per 1M requests with no method-by-method weighting at all here",
    ],
    answer:0,
    explain:"Alchemy's pricing page lists Pay as you go starting at $0.40 per 1M Compute Units. The free tier includes 30M CUs / month before PAYG kicks in." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"In Subgraph terms, what does a 'mapping' module written in AssemblyScript do?",
    options:[
      "Translates raw on-chain event data into the subgraph's stored schema",
      "Builds a website's user interface from a generic GraphQL schema file",
      "Compiles a Solidity contract directly into runnable EVM bytecode",
      "Defines block validators a subgraph chooses to trust during indexing",
    ],
    answer:0,
    explain:"Subgraph mappings (in AssemblyScript) consume raw events from the blockchain and write entities defined in schema.graphql, which is what GraphQL queries return." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What is a Bundler in the ERC-4337 architecture?",
    options:[
      "A node that aggregates UserOperations into one on-chain transaction",
      "A wallet UI helper that bundles multiple end-user signing prompts",
      "A scaling sidechain that batches Layer 1 finality for L2 use cases",
      "A token-distribution contract used by airdrop programs at scale",
    ],
    answer:0,
    explain:"Bundlers collect UserOperations from a separate mempool and submit them in a single on-chain transaction via the EntryPoint contract. Alchemy operates a Bundler." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"At what valuation did Alchemy's February 2022 round close?",
    options:[
      "$10.2B, on a $200M round led by Lightspeed and Silver Lake",
      "$5.5B, on a $100M round led by Andreessen Horowitz and Coatue",
      "$15.0B, on a $400M round led by Tiger Global and Sequoia",
      "$3.0B, on a $150M round led by Founders Fund and Paradigm",
    ],
    answer:0,
    explain:"In February 2022, Alchemy raised $200M at a $10.2B valuation, led by Lightspeed and Silver Lake. Confirmed by Silver Lake's press, Blockworks, and CNBC." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"Who led Alchemy's Series A round in 2019?",
    options:[
      "Pantera Capital, with $15M raised in the December 2019 round",
      "Sequoia Capital, with $25M raised in the December 2019 round",
      "Andreessen Horowitz, with $40M raised in late 2020 in one round",
      "Coatue Management, with $10M raised in the early 2019 cycle",
    ],
    answer:0,
    explain:"Alchemy's Series A in December 2019 raised $15M led by Pantera Capital, with Stanford, Coinbase, Reid Hoffman, Charles Schwab, and Jerry Yang as additional backers." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"Which NFT platform did Alchemy acquire in 2025?",
    options:[
      "HeyMint, a no-code NFT launchpad based in California today",
      "Manifold, a popular smart-contract platform for NFT creators",
      "Zora, the on-chain NFT and creator-rewards protocol on Base",
      "Foundation, a curated NFT marketplace platform for creators",
    ],
    answer:0,
    explain:"In May 2025 Alchemy acquired HeyMint, a no-code NFT launchpad. CTO Flor Ronsmans De Vry joined Alchemy. Reported by crypto.news and Binance Square." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"Which of these well-known names is on Alchemy's published investor list?",
    options:[
      "Jay-Z and Will Smith, listed alongside other celebrity backers",
      "Mark Cuban and Ashton Kutcher, listed via their A-Grade fund",
      "Snoop Dogg and Lil Wayne, two musicians known for crypto bets",
      "Tom Brady and Larry David, from the FTX-era endorsement crowd",
    ],
    answer:0,
    explain:"Alchemy's company page lists Jay-Z, Will Smith, Jared Leto, Keisuke Honda, and the Chainsmokers among its investors, alongside Stanford and major tech founders." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"What does Alchemy market as the 'world's first intelligent blockchain engine'?",
    options:[
      "Cortex, claimed to give 13x throughput and 5x reliability gains",
      "Synapse, claimed to predict mempool reorgs at sub-block latency",
      "Fusion, claimed to converge consensus across non-EVM chain stacks",
      "Helios, claimed to be a free archival node that any team can run",
    ],
    answer:0,
    explain:"Alchemy's homepage advertises 'Cortex, the world's first intelligent blockchain engine,' claiming 13x more throughput and 5x more reliability than other providers." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"What does Alchemy's Reinforced Transactions service do?",
    options:[
      "Auto-bumps gas and resubmits a transaction when one gets stuck",
      "Rolls a transaction back if the resulting state proves unwanted",
      "Compresses a calldata payload before sending it into the mempool",
      "Posts a transaction across multiple chains for redundancy gains",
    ],
    answer:0,
    explain:"Reinforced Transactions automatically bumps gas and resubmits transactions that get stuck, so application code does not need bespoke mempool tracking logic." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"For NFT galleries, why is alchemy_getNFTs preferred over per-token tokenURI calls?",
    options:[
      "It batches metadata, ownership, and media URLs in one paginated reply",
      "It signs NFT mints on behalf of users, removing every gas requirement",
      "It permanently caches every NFT image on chain via decentralized storage",
      "It enforces ERC-2981 royalty splits on each marketplace transaction now",
    ],
    answer:0,
    explain:"alchemy_getNFTs returns metadata, ownership, and media URLs in one paginated call. The cost-per-call is higher, but it replaces dozens of raw RPC requests per page." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"How do you verify a webhook payload truly came from Alchemy Notify?",
    options:[
      "Validate the X-Alchemy-Signature header against your signing secret",
      "Trust the source IP entirely, since Alchemy uses fixed static IP ranges",
      "Skip verification on TLS-terminated traffic, since TLS is enough alone",
      "Check the timestamp field exclusively for any payload accepted today",
    ],
    answer:0,
    explain:"Each webhook delivery includes an X-Alchemy-Signature HMAC. Verify it against your signing secret on the server before trusting the payload, just like Stripe webhooks." },
  { id:"e9", topic:"industry", level:"expert",
    q:"What is the EntryPoint contract in ERC-4337's design?",
    options:[
      "The single on-chain contract through which all UserOperations execute",
      "A registry of every smart wallet that the EVM has ever deployed yet",
      "A specific wallet UI library that simplifies user signing prompt UX",
      "An off-chain mempool service that orders pending UserOperations now",
    ],
    answer:0,
    explain:"EntryPoint is the canonical on-chain contract that processes UserOperations, calls the wallet, optionally calls a Paymaster, and handles the gas accounting flow." },
  { id:"e10", topic:"industry", level:"expert",
    q:"Why does ERC-4337 use a separate UserOperation mempool from the regular tx mempool?",
    options:[
      "UserOperations have different validation rules than regular transactions",
      "Validators refuse to look at any pending standard mempool transactions",
      "Account abstraction wallets sign valid Ethereum transactions natively",
      "Bundlers are forced to broadcast each UserOperation to every chain now",
    ],
    answer:0,
    explain:"UserOperations carry validation logic that an EOA tx does not. They live in a separate alt-mempool until a Bundler picks them up and submits a real tx to EntryPoint." },
  { id:"e11", topic:"industry", level:"expert",
    q:"Why is reorg handling logic important for a subgraph indexer in production?",
    options:[
      "Without it, reverted blocks leave stale entities in the indexed dataset",
      "Without it, subgraphs cannot serve any GraphQL traffic to clients at all",
      "Reorg handling controls the gas cost of every on-chain write event",
      "It dictates which validators a subgraph indexer will trust over time",
    ],
    answer:0,
    explain:"Reorgs roll back recent blocks. Subgraphs handle reorgs by reverting affected entities; without that logic, the indexed dataset diverges from canonical chain state." },
  { id:"e12", topic:"industry", level:"expert",
    q:"Why do production webhook consumers usually need an idempotency strategy?",
    options:[
      "Webhooks can be redelivered, so handlers must dedupe by event ID",
      "Webhooks always arrive exactly once, so dedupe logic is unnecessary",
      "Webhooks fire only on the very first matching event in long history",
      "Webhooks include a built-in lock that prevents any duplicate processing",
    ],
    answer:0,
    explain:"Webhook providers (including Alchemy) retry on 5xx or timeouts. Consumers dedupe by event ID or transaction hash to avoid double-processing the same delivery." },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Alchemy company fun facts",
  "company-products": "Alchemy product line",
  industry: "Web3 industry concepts",
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
