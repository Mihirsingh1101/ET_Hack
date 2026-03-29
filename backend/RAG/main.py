import time
import retrieve
import generate

def print_banner():
    print("\n" + "="*60)
    print(" 🛡️  SENTINEL AI - EVENT-DRIVEN RAG ACTIVE")
    print(f" 🤖  LLM: {generate.MODEL_NAME}")
    print("="*60)

# ==========================================
# 1. The Hardcoded Data Contract (From Teammate)
# ==========================================
# When your teammate finishes their engine, they will send this JSON to your API
INCOMING_INSIGHT_PAYLOAD = {
    "ticker": "RELIANCE.NS",
    "sector": "Conglomerate/Energy",
    "insight_text": "Sudden bullish volume spike. Price broke above the 50-day SMA. High momentum detected.",
    "timestamp": "2026-03-27 14:30:00"
}

def run_insight_workflow():
    print_banner()
    
    print("📡 [SYSTEM] Waiting for quantitative triggers...")
    time.sleep(1) # Dramatic effect for the live demo
    
    # ---------------------------------------------------------
    # PHASE 1: INTAKE & PROCUREMENT
    # ---------------------------------------------------------
    print("\n🚨 [ALERT] New Market Insight Received from Quant Engine!")
    print(f"   ► Target: {INCOMING_INSIGHT_PAYLOAD['ticker']}")
    print(f"   ► Event:  {INCOMING_INSIGHT_PAYLOAD['insight_text']}")
    
    print("\n🔍 [RETRIEVAL] Procuring relevant news to determine the 'Why'...")
    
    # We construct a dummy query so retrieve.py's regex can extract the ticker
    # and use the insight text for the semantic search.
    search_query = f"@{INCOMING_INSIGHT_PAYLOAD['ticker']} {INCOMING_INSIGHT_PAYLOAD['insight_text']}"
    snippets = retrieve.search_insight(search_query, top_k=7, max_distance=1.2)
    
    if snippets:
        print(f"✅ [RETRIEVAL] Procured {len(snippets)} relevant articles.")
    else:
        print("⚠️ [RETRIEVAL] No highly relevant news found. Move may be purely technical.")

    # ---------------------------------------------------------
    # PHASE 2: INITIAL BRIEFING
    # ---------------------------------------------------------
    print("\n🧠 [GENERATION] Compiling initial Sentinel Analysis...")
    chat_history = []
    
    # We auto-generate the first question to kick off the analysis
    initial_prompt = "Explain why this insight is occurring based on the latest news. Give me 3 bullet points."
    
    initial_analysis = generate.chat_about_insight(
        user_message=initial_prompt, 
        insight_data=INCOMING_INSIGHT_PAYLOAD, 
        news_snippets=snippets, 
        chat_history=chat_history
    )
    
    print("\n" + "="*70)
    print(f" 📊 SENTINEL BRIEFING: {INCOMING_INSIGHT_PAYLOAD['ticker']}")
    print("="*70)
    print(initial_analysis)
    print("="*70)
    
    # Save the initial interaction to memory
    chat_history.append({"user": initial_prompt, "ai": initial_analysis})

    # ---------------------------------------------------------
    # PHASE 3: CONVERSATIONAL LOOP
    # ---------------------------------------------------------
    print("\n💬 [CHAT] You can now interrogate Sentinel AI about this specific event.")
    print("Type 'exit' to quit the terminal.\n")
    
    while True:
        try:
            user_msg = input("🟢 [JUDGE]: ").strip()
            if not user_msg: continue
            if user_msg.lower() in ['exit', 'quit']: break
            
            print("⏳ Thinking...")
            response = generate.chat_about_insight(
                user_message=user_msg, 
                insight_data=INCOMING_INSIGHT_PAYLOAD, 
                news_snippets=snippets, 
                chat_history=chat_history
            )
            
            print(f"\n🤖 [SENTINEL]: {response}\n")
            
            # Append to memory
            chat_history.append({"user": user_msg, "ai": response})
            
        except KeyboardInterrupt:
            break
            
    print("\nClosing connection.")

if __name__ == "__main__":
    run_insight_workflow()