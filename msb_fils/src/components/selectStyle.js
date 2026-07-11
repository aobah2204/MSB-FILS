export const selectStyle = {
                          control: (base) => ({
                              ...base,
                              backgroundColor: "#1E293B",
                              color: "white",
                              borderColor: "#2563EB",
                              minHeight: 45
                          }),   

                          singleValue: (base) => ({
                              ...base,
                              color: "white"
                          }),

                          input: (base) => ({
                              ...base,
                              color: "white"
                          }),

                          menu: (base) => ({
                              ...base,
                              backgroundColor: "#1E293B"
                          }),

                          option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                  ? "#2563EB"
                                  : state.isFocused
                                  ? "#334155"
                                  : "#1E293B",
                              color: "white",
                              cursor: "pointer"
                          }),

                          placeholder: (base) => ({
                              ...base,
                              color: "#CBD5E1"
                          })
  };