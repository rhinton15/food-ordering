import React, { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChefContext } from "./ChefContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Batch from "./Batch";

function Cooking(props) {
  const { madeToOrder, orders, cooking, setCooking } = useContext(ChefContext);
  const [selectedBatch, setSelectedBatch] = useState();
  const [groupOrders, setGroupOrders] = useState([]);

  const nextOrder = orders.find(
    (o) =>
      !o.done &&
      o.order.some((item) =>
        madeToOrder.some(
          (mto) => mto.sectionId === item.sectionId && mto.index === item.index
        )
      )
  );

  const flatOrders = orders
    .filter((o) => !o.done)
    .flatMap((o) =>
      o.order.map((item) => {
        const { customize, ...rest } = item;
        return {
          ...rest,
          sel: customize?.[0].options,
          orderId: o.id,
          guest: o.name,
        };
      })
    );
  const groupedOrders = madeToOrder.map((mto) => {
    const groupOptions = mto.customize.flatMap((c) => c.options);
    const group = {
      ...mto,
      orders: flatOrders
        .filter((o) => o.sectionId === mto.sectionId && o.index === mto.index)
        .map((o) => {
          const { sel, ...rest } = o;
          return {
            ...rest,
            sel: (sel || [])
              .filter((o) => groupOptions.includes(o))
              .sort()
              .join(", "),
          };
        }),
      cooking: cooking.filter(
        (c) => c.sectionId === mto.sectionId && c.index === mto.index
      ),
    };
    if (
      mto.customize.filter((c) => c.madeToOrder).flatMap((c) => c.options)
        .length <= 2
    ) {
      group.groupedOrders = group.orders.reduce((x, y) => {
        (x[y.sel] = x[y.sel] || []).push(y);

        return x;
      }, {});
    }
    group.remaining =
      group.orders
        .map((item) => item.quantity)
        .reduce((partialSum, a) => partialSum + a, 0) -
      group.cooking
        .map((item) => item.quantity)
        .reduce((partialSum, a) => partialSum + a, 0);
    return group;
  });

  function startCooking(g) {
    // setGroupOrders(g);
    // setSelectedBatch({});
  }

  function startBatch(batch) {
    setCooking((prev) => [batch, ...prev]);
    setSelectedBatch();
  }

  function toggleDone(item) {
    setCooking(
      cooking.map((c) =>
        c.orderId === item.orderId ? { ...c, done: !c.done } : c
      )
    );
  }

  function deleteCooking(item) {
    setCooking(cooking.filter((c) => c.orderId !== item.orderId));
  }

  return (
    <>
      <Batch
        selectedItem={selectedBatch}
        setSelectedItem={setSelectedBatch}
        orders={groupOrders}
        cooking={cooking}
        startBatch={startBatch}
      />
      <View style={{ padding: 8, gap: 8 }}>
        {/* <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center" }}>
          Next Up: {nextOrder?.name}
        </Text> */}
        {groupedOrders.map((g) => (
          <Pressable
            key={`${g.sectionId}-${g.index}`}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#cccccc",
              padding: 8,
            }}
            onPress={() => startCooking(g)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {g.remaining} {g.name}
              </Text>
              {/* <Pressable onPress={() => startCooking(g)}>
                <MaterialCommunityIcons name="play" color="#30ba55" size={24} />
              </Pressable> */}
            </View>
            {g.cooking.length > 0 &&
              g.cooking.map((c, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {c.done ? (
                      <Pressable onPress={() => toggleDone(c)}>
                        <MaterialCommunityIcons
                          name="check"
                          color="#30ba55"
                          size={20}
                        />
                      </Pressable>
                    ) : (
                      <Pressable onPress={() => toggleDone(c)}>
                        <MaterialCommunityIcons
                          name="grill"
                          color="#000000"
                          size={20}
                        />
                      </Pressable>
                    )}
                    <Text>
                      {c.quantity} {c.selection}
                    </Text>
                  </View>
                  {!c.done && (
                    <Pressable onPress={() => deleteCooking(c)}>
                      <MaterialCommunityIcons
                        name="undo-variant"
                        color="#aaaaaa"
                        size={24}
                      />
                    </Pressable>
                  )}
                </View>
              ))}
            {g.groupedOrders &&
              Object.keys(g.groupedOrders)
                .sort()
                .map((go) => (
                  <Text key={go}>
                    {g.groupedOrders[go].reduce(
                      (partialSum, a) => partialSum + a.quantity,
                      0
                    )}{" "}
                    {go || "plain"}
                  </Text>
                ))}
            {!g.groupedOrders &&
              g.orders.map((o) => (
                <Text key={o.orderId}>
                  {o.quantity} {o.sel || "plain"}
                </Text>
              ))}
          </Pressable>
        ))}
      </View>
    </>
  );
}

export default Cooking;
