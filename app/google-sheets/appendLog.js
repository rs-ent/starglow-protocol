export async function appendLogClient(rowData) {
    const res = await fetch("/api/append-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowData }),
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || "append-log failed");
    }
}