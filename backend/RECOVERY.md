# DNA recovery

New simulations produce seven independently corrupted reads of each four-base
strand. `bases` is the first read used by the existing sequence viewer, error
events and simulation metrics; `reads` contains all seven, including the first.
Dropout produces an empty read. Reads are grouped by strand by the simulator;
clustering and strand-address recovery are outside this model.

Recovery computes an exact fixed-length Levenshtein consensus: enumerate all
256 four-base sequences and minimize the sum of unit-cost edit distances to the
observed reads. Substitution, insertion and deletion each cost one. This uses
only the noisy reads and the known encoding length, never the original text or
bases. Equal best scores and complete dropout return an erasure (`?`). A unique
consensus may still be wrong, especially with correlated errors or few reads.
The method assumes independent errors and is not a probabilistic decoder.

Ground truth is compared by strand ID only after reconstruction to calculate
successRate (fraction of exactly reconstructed source strands). Corrections is
the edit distance from the displayed first read to the resolved consensus,
not a count of proven repairs. Unresolved strands contribute no corrections.
Recovery is deterministic; error simulation remains random.

Saved strands retain reads. Legacy records without reads use their single
observed sequence, with no fabricated redundancy or reference-based repair.
A lone substitution cannot be detected with this uncoded representation.
The existing four-base/one-byte encoding and printable-ASCII decoder remain;
this change does not add Unicode encoding. Exhaustive consensus is suitable
for these four-base strands, not realistic long oligos (4^length candidates).

Run regression tests: `npm test` from backend.

## Selectable Needleman-Wunsch consensus

POST /api/simulation/recover accepts optional `algorithm`:
`levenshtein-consensus` (default for legacy clients) or `needleman-wunsch`.
Unknown algorithms return HTTP 400. Both use exactly the submitted reads.

Needleman-Wunsch uses global alignment with match +2, mismatch -1 and linear
gap -2. Select an observed anchor with greatest total pairwise alignment score
(lexical tie-break), align each nonempty read to it, merge insertion slots
left-aligned with gap padding, and vote by column including gaps. A strict
majority is required; missing majorities or a result length other than four
produce an erasure. Empty reads abstain. Tied pairwise tracebacks prefer
diagonal, deletion, then insertion. This deterministic center-star heuristic
is not an optimal multiple alignment and may differ from exact Levenshtein
consensus, especially for repeats and ambiguous alignments. Neither method
consults original bases or guarantees correct reconstruction.

The frontend can rerun recovery with another method without resimulating
errors. New saved simulations retain the complete recovery result, including
algorithm and reconstructed strands; old records remain loadable.
