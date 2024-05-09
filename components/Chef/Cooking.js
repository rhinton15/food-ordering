import React, { useContext } from "react";
import { Text, View } from "react-native";
import { ChefContext } from "./ChefContext";

function Cooking(props) {
  const { madeToOrder, orders } = useContext(ChefContext);
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
        return { ...rest, sel: customize?.[0].options, orderId: o.id };
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
    return group;
  });

  return (
    <View style={{ padding: 8, gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center" }}>
        Next Up: {nextOrder?.name}
      </Text>
      {groupedOrders.map((g) => (
        <View
          key={`${g.sectionId}-${g.index}`}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#cccccc",
            // borderColor: g.orders.some((o) => o.orderId === nextOrder.id)
            //   ? "red"
            //   : "#cccccc",
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {g.orders
              .map((item) => item.quantity)
              .reduce((partialSum, a) => partialSum + a, 0)}{" "}
            {g.name}
          </Text>
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
        </View>
      ))}
    </View>
  );
}

export default Cooking;
