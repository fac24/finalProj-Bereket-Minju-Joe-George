export default function FromToVia({ from, to, vias = [] }) {
  return (
    <h2>
      From <b>{from}</b> to <b>{to}</b>
      {vias.length === 0 ? null : (
        <div>
          via{" "}
          {vias.map((element, index, array) => (
            <>
              <b>{element}</b>
              {index === array.length - 1 ? null : index ===
                array.length - 2 ? (
                <> and </>
              ) : (
                <>
                  , <br />
                </>
              )}
            </>
          ))}
        </div>
      )}
    </h2>
  );
}
